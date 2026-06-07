-- AlterTable
ALTER TABLE "students" ALTER COLUMN "password" DROP NOT NULL;

-- AlterTable
ALTER TABLE "students" ADD COLUMN "google_id" VARCHAR(100);
ALTER TABLE "students" ALTER COLUMN "passport_photo" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "uploaded_documents" ALTER COLUMN "file_path" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "students_google_id_key" ON "students"("google_id");
