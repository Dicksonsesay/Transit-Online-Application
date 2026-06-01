"use server";

import { revalidatePath } from "next/cache";
import {
  syncStudentFromPersonal,
  upsertFormDraft,
} from "@/lib/application-form/db";
import { mergeFormData } from "@/lib/application-form/defaults";
import {
  formatZodErrors,
  sectionSchemas,
  type SectionSchemaKey,
} from "@/lib/application-form/schemas";
import { submitApplicationForm } from "@/lib/application-form/submit";
import { prisma } from "@/lib/prisma";
import { requireStudentSession } from "@/lib/session";
import {
  APPLICATION_SECTION_COUNT,
  APPLICATION_SECTIONS,
  type ApplicationFormData,
  type ApplicationSectionKey,
} from "@/types/application-form";

export type SaveSectionResult = {
  error?: string;
  success?: boolean;
  nextSection?: number;
};

function parseStudentId(sessionUserId: string | undefined): number | null {
  const id = Number.parseInt(sessionUserId ?? "", 10);
  return Number.isNaN(id) ? null : id;
}

const sectionKeyById = Object.fromEntries(
  APPLICATION_SECTIONS.map((s) => [s.id, s.key])
) as Record<number, ApplicationSectionKey>;

export async function saveApplicationSectionAction(
  sectionId: number,
  payload: unknown,
  direction: "next" | "stay" = "next"
): Promise<SaveSectionResult> {
  const session = await requireStudentSession();
  if (!session) {
    return { error: "You must be signed in." };
  }

  const studentId = parseStudentId(session.user.id);
  if (studentId === null) {
    return { error: "Invalid session." };
  }

  const existingApp = await prisma.application.findUnique({
    where: { studentId },
  });
  if (existingApp) {
    return { error: "Your application has already been submitted." };
  }

  if (sectionId < 1 || sectionId > APPLICATION_SECTION_COUNT) {
    return { error: "Invalid section." };
  }

  const sectionKey = sectionKeyById[sectionId] as SectionSchemaKey;
  const schema = sectionSchemas[sectionKey];
  const parsed = schema.safeParse(payload);

  if (!parsed.success) {
    return { error: formatZodErrors(parsed.error) };
  }

  const draft = await prisma.applicationFormDraft.findUnique({
    where: { studentId },
  });

  const currentData = mergeFormData(
    (draft?.formData as ApplicationFormData | null) ?? undefined
  );

  const updatedData: ApplicationFormData = {
    ...currentData,
    [sectionKey]: parsed.data,
  };

  const nextSection =
    direction === "next" ? Math.min(sectionId + 1, APPLICATION_SECTION_COUNT) : sectionId;

  await upsertFormDraft(studentId, updatedData, nextSection);

  if (sectionKey === "personal" && updatedData.personal) {
    await syncStudentFromPersonal(studentId, updatedData.personal);
  }

  revalidatePath("/student/application");
  revalidatePath("/student");

  return { success: true, nextSection };
}

export async function submitApplicationAction(
  payload: ApplicationFormData
): Promise<{ error?: string; success?: boolean }> {
  const session = await requireStudentSession();
  if (!session) {
    return { error: "You must be signed in." };
  }

  const studentId = parseStudentId(session.user.id);
  if (studentId === null) {
    return { error: "Invalid session." };
  }

  const merged = mergeFormData(payload);
  const result = await submitApplicationForm(studentId, merged);

  if (result.error) {
    return { error: result.error };
  }

  revalidatePath("/student/application");
  revalidatePath("/student");

  return { success: true };
}
