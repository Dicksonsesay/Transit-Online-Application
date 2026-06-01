-- AlterTable
ALTER TABLE "applications" ADD COLUMN     "form_payload" JSONB;

-- CreateTable
CREATE TABLE "application_form_drafts" (
    "id" SERIAL NOT NULL,
    "student_id" INTEGER NOT NULL,
    "current_section" INTEGER NOT NULL DEFAULT 1,
    "form_data" JSONB NOT NULL DEFAULT '{}',
    "submitted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "application_form_drafts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "application_form_drafts_student_id_key" ON "application_form_drafts"("student_id");

-- AddForeignKey
ALTER TABLE "application_form_drafts" ADD CONSTRAINT "application_form_drafts_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;
