import { createStudentNotification } from "@/lib/notifications";
import { prisma } from "@/lib/prisma";
import { mergeFormData } from "@/lib/application-form/defaults";
import { matchCollegeProgrammeName } from "@/lib/application-form/programme-resolution";
import {
  declarationSchema,
  documentsSchema,
  educationalBackgroundSchema,
  enrolmentSchema,
  firstSittingSchema,
  parentGuardianSchema,
  personalSchema,
  refereesSchema,
  secondSittingSchema,
  sponsorshipSchema,
  universityDegreesSchema,
} from "@/lib/application-form/schemas";
import { APPLICATION_SECTION_COUNT } from "@/types/application-form";
import type { ApplicationFormData } from "@/types/application-form";
import type { Prisma } from "@/generated/prisma/client";
import { ApplicationStatus } from "@/generated/prisma/client";

function validateCompleteForm(data: ApplicationFormData): string | null {
  const merged = mergeFormData(data);
  const checks = [
    personalSchema.safeParse(merged.personal),
    enrolmentSchema.safeParse(merged.enrolment),
    educationalBackgroundSchema.safeParse(merged.educationalBackground),
    firstSittingSchema.safeParse(merged.firstSitting),
    secondSittingSchema.safeParse(merged.secondSitting),
    universityDegreesSchema.safeParse(merged.universityDegrees),
    parentGuardianSchema.safeParse(merged.parentGuardian),
    sponsorshipSchema.safeParse(merged.sponsorship),
    documentsSchema.safeParse(merged.documents),
    refereesSchema.safeParse(merged.referees),
    declarationSchema.safeParse(merged.declaration),
  ];

  const failed = checks.find((c) => !c.success);
  if (failed && !failed.success) {
    return failed.error.issues[0]?.message ?? "Application is incomplete.";
  }
  return null;
}

async function resolveProgrammeId(
  enrolment: ApplicationFormData["enrolment"]
): Promise<number> {
  const search = enrolment?.firstChoiceCourse?.trim();
  if (search) {
    const collegeMatch = matchCollegeProgrammeName(search);
    if (collegeMatch) {
      const matched = await prisma.programme.findFirst({
        where: {
          status: "active",
          programmeName: { equals: collegeMatch, mode: "insensitive" },
        },
        select: { id: true },
      });
      if (matched) return matched.id;
    }

    const exact = await prisma.programme.findFirst({
      where: {
        status: "active",
        programmeName: { equals: search, mode: "insensitive" },
      },
      select: { id: true },
    });
    if (exact) return exact.id;

    const partial = await prisma.programme.findFirst({
      where: {
        status: "active",
        programmeName: { contains: search, mode: "insensitive" },
      },
      select: { id: true },
    });
    if (partial) return partial.id;
  }

  const fallback = await prisma.programme.findFirst({
    where: { status: "active" },
    orderBy: { id: "asc" },
    select: { id: true },
  });

  if (!fallback) {
    throw new Error("No active programmes configured. Contact admissions.");
  }

  return fallback.id;
}

export async function submitApplicationForm(
  studentId: number,
  formData: ApplicationFormData
) {
  const merged = mergeFormData(formData);
  const validationError = validateCompleteForm(merged);
  if (validationError) {
    return { error: validationError };
  }

  const existing = await prisma.application.findUnique({
    where: { studentId },
  });
  if (existing) {
    return { error: "Your application has already been submitted." };
  }

  const programmeId = await resolveProgrammeId(merged.enrolment);
  const guardian = merged.parentGuardian;
  const firstSchool = merged.educationalBackground?.find((r) =>
    r.institutionName?.trim()
  );

  await prisma.$transaction(async (tx) => {
    await tx.application.create({
      data: {
        studentId,
        programmeId,
        previousSchool: firstSchool?.institutionName ?? null,
        waecIndexNumber: merged.firstSitting?.examinationNumber ?? null,
        waecYear: merged.firstSitting?.yearTaken ?? null,
        aggregateScore: null,
        guardianName: guardian?.name ?? null,
        guardianPhone: guardian?.contactNumbers ?? null,
        guardianAddress: guardian?.homeAddress ?? null,
        formPayload: merged as Prisma.InputJsonValue,
        applicationStatus: ApplicationStatus.submitted,
      },
    });

    await tx.applicationFormDraft.updateMany({
      where: { studentId },
      data: { submittedAt: new Date(), currentSection: APPLICATION_SECTION_COUNT },
    });
  });

  const student = await prisma.student.findUnique({
    where: { id: studentId },
    select: { fullname: true, applicationNumber: true },
  });

  const appNumber = student?.applicationNumber
    ? ` Your application number is ${student.applicationNumber}.`
    : "";

  await createStudentNotification({
    studentId,
    notificationType: "general",
    title: "Application submitted",
    message: `Thank you, ${student?.fullname ?? "applicant"}. Your admission application has been received and is under review.${appNumber} We will notify you by email and in your student portal when there are updates.`,
  });

  return { success: true as const };
}
