import { prisma } from "@/lib/prisma";
import { emptyDocuments, mergeFormData } from "@/lib/application-form/defaults";
import type {
  ApplicationDocuments,
  ApplicationFormData,
  UploadedFileMeta,
} from "@/types/application-form";
import { APPLICATION_SECTION_COUNT } from "@/types/application-form";
import type { Prisma } from "@/generated/prisma/client";

function buildDocumentsFromUploads(
  uploads: { documentType: string; filePath: string }[]
): ApplicationDocuments {
  const docs = emptyDocuments();
  const other: UploadedFileMeta[] = [];

  for (const upload of uploads) {
    const meta: UploadedFileMeta = {
      filePath: upload.filePath,
      fileName: upload.filePath.split("/").pop() ?? upload.documentType,
    };
    switch (upload.documentType) {
      case "wassce":
        docs.wassce = meta;
        break;
      case "birth_certificate":
        docs.birthCertificate = meta;
        break;
      case "national_id":
        docs.nationalId = meta;
        break;
      case "other":
        other.push(meta);
        break;
      default:
        break;
    }
  }

  if (other.length) docs.other = other;
  return docs;
}

export async function getStudentApplicationContext(studentId: number) {
  const [student, draft, application, programmes, uploadedDocs] =
    await Promise.all([
    prisma.student.findUnique({
      where: { id: studentId },
      select: {
        id: true,
        fullname: true,
        email: true,
        phone: true,
        gender: true,
        dateOfBirth: true,
        address: true,
        nationality: true,
        passportPhoto: true,
      },
    }),
    prisma.applicationFormDraft.findUnique({
      where: { studentId },
    }),
    prisma.application.findUnique({
      where: { studentId },
      select: {
        id: true,
        applicationStatus: true,
        submittedAt: true,
        formPayload: true,
      },
    }),
    prisma.programme.findMany({
      where: { status: "active" },
      orderBy: { programmeName: "asc" },
      select: { id: true, programmeName: true, department: true },
    }),
    prisma.uploadedDocument.findMany({
      where: { studentId },
      select: { documentType: true, filePath: true },
    }),
  ]);

  const formData = mergeFormData(
    (draft?.formData as ApplicationFormData | null) ?? undefined
  );

  if (!formData.personal && student) {
    const nameParts = student.fullname.trim().split(/\s+/);
    formData.personal = {
      title: "mr",
      surname: nameParts.length > 1 ? nameParts[nameParts.length - 1]! : nameParts[0] ?? "",
      firstName: nameParts[0] ?? "",
      otherNames:
        nameParts.length > 2 ? nameParts.slice(1, -1).join(" ") : "",
      sex: student.gender === "female" ? "female" : "male",
      dateOfBirth: student.dateOfBirth
        ? student.dateOfBirth.toISOString().slice(0, 10)
        : "",
      contactNumbers: student.phone ?? "",
      email: student.email,
      currentAddress: student.address ?? "",
      permanentAddress: student.address ?? "",
      district: "",
      region: "",
      nationality: student.nationality ?? "",
      religion: "",
      passportPhotoUrl: student.passportPhoto ?? undefined,
    };
  } else if (student?.passportPhoto && formData.personal) {
    formData.personal.passportPhotoUrl =
      formData.personal.passportPhotoUrl || student.passportPhoto;
  }

  const storedDocs = formData.documents ?? emptyDocuments();
  const dbDocs = buildDocumentsFromUploads(uploadedDocs);
  formData.documents = {
    wassce: storedDocs.wassce ?? dbDocs.wassce,
    birthCertificate: storedDocs.birthCertificate ?? dbDocs.birthCertificate,
    nationalId: storedDocs.nationalId ?? dbDocs.nationalId,
    other:
      storedDocs.other?.length ? storedDocs.other : dbDocs.other,
  };

  const currentSection = Math.min(
    draft?.currentSection ?? 1,
    APPLICATION_SECTION_COUNT
  );

  return {
    student,
    draft: draft
      ? {
          currentSection,
          formData,
          submittedAt: draft.submittedAt,
        }
      : { currentSection: 1, formData, submittedAt: null },
    application,
    programmes,
    isSubmitted: Boolean(application),
  };
}

export async function upsertFormDraft(
  studentId: number,
  formData: ApplicationFormData,
  currentSection: number
) {
  return prisma.applicationFormDraft.upsert({
    where: { studentId },
    create: {
      studentId,
      formData: formData as Prisma.InputJsonValue,
      currentSection,
    },
    update: {
      formData: formData as Prisma.InputJsonValue,
      currentSection,
    },
  });
}

export async function syncStudentFromPersonal(
  studentId: number,
  personal: ApplicationFormData["personal"]
) {
  if (!personal) return;

  const fullname = [
    personal.firstName,
    personal.otherNames,
    personal.surname,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  await prisma.student.update({
    where: { id: studentId },
    data: {
      fullname: fullname || undefined,
      gender: personal.sex,
      dateOfBirth: personal.dateOfBirth
        ? new Date(personal.dateOfBirth)
        : undefined,
      phone: personal.contactNumbers || undefined,
      email: personal.email,
      address: personal.currentAddress || undefined,
      nationality: personal.nationality || undefined,
      passportPhoto: personal.passportPhotoUrl || undefined,
    },
  });
}
