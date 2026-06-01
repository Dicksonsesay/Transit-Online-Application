-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('super_admin', 'admin', 'admissions_officer');

-- CreateEnum
CREATE TYPE "AdminStatus" AS ENUM ('active', 'inactive', 'suspended');

-- CreateEnum
CREATE TYPE "PinStatus" AS ENUM ('unused', 'used');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('male', 'female', 'other');

-- CreateEnum
CREATE TYPE "StudentAccountStatus" AS ENUM ('active', 'inactive', 'pending', 'suspended');

-- CreateEnum
CREATE TYPE "ProgrammeStatus" AS ENUM ('active', 'inactive');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('submitted', 'under_review', 'interview_scheduled', 'interviewed', 'accepted', 'rejected');

-- CreateEnum
CREATE TYPE "InterviewStatus" AS ENUM ('scheduled', 'completed', 'missed', 'cancelled');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('interview', 'acceptance', 'rejection', 'general');

-- CreateTable
CREATE TABLE "admins" (
    "id" SERIAL NOT NULL,
    "fullname" VARCHAR(150) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "phone" VARCHAR(20),
    "password" VARCHAR(255) NOT NULL,
    "role" "AdminRole" NOT NULL DEFAULT 'admin',
    "status" "AdminStatus" NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pins" (
    "id" SERIAL NOT NULL,
    "pin_code" VARCHAR(50) NOT NULL,
    "receipt_number" VARCHAR(100),
    "amount" DECIMAL(10,2) NOT NULL,
    "status" "PinStatus" NOT NULL DEFAULT 'unused',
    "generated_by" INTEGER NOT NULL,
    "used_by_student" INTEGER,
    "used_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "students" (
    "id" SERIAL NOT NULL,
    "application_number" VARCHAR(100),
    "fullname" VARCHAR(150) NOT NULL,
    "gender" "Gender" NOT NULL,
    "date_of_birth" DATE NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "phone" VARCHAR(20),
    "password" VARCHAR(255) NOT NULL,
    "address" TEXT,
    "nationality" VARCHAR(100),
    "passport_photo" VARCHAR(255),
    "pin_id" INTEGER,
    "account_status" "StudentAccountStatus" NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "programmes" (
    "id" SERIAL NOT NULL,
    "programme_name" VARCHAR(200) NOT NULL,
    "department" VARCHAR(150) NOT NULL,
    "duration" VARCHAR(50) NOT NULL,
    "status" "ProgrammeStatus" NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "programmes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "applications" (
    "id" SERIAL NOT NULL,
    "student_id" INTEGER NOT NULL,
    "programme_id" INTEGER NOT NULL,
    "previous_school" VARCHAR(255),
    "waec_index_number" VARCHAR(100),
    "waec_year" VARCHAR(10),
    "aggregate_score" VARCHAR(20),
    "guardian_name" VARCHAR(150),
    "guardian_phone" VARCHAR(20),
    "guardian_address" TEXT,
    "application_status" "ApplicationStatus" NOT NULL DEFAULT 'submitted',
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interviews" (
    "id" SERIAL NOT NULL,
    "student_id" INTEGER NOT NULL,
    "scheduled_by" INTEGER NOT NULL,
    "interview_date" DATE NOT NULL,
    "interview_time" TIME(0) NOT NULL,
    "venue" VARCHAR(255),
    "meeting_link" VARCHAR(255),
    "interview_status" "InterviewStatus" NOT NULL DEFAULT 'scheduled',
    "remarks" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "interviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "uploaded_documents" (
    "id" SERIAL NOT NULL,
    "student_id" INTEGER NOT NULL,
    "document_type" VARCHAR(100) NOT NULL,
    "file_path" VARCHAR(255) NOT NULL,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "uploaded_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" SERIAL NOT NULL,
    "student_id" INTEGER NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "message" TEXT NOT NULL,
    "notification_type" "NotificationType" NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "acceptance_letters" (
    "id" SERIAL NOT NULL,
    "student_id" INTEGER NOT NULL,
    "letter_reference" VARCHAR(100) NOT NULL,
    "pdf_path" VARCHAR(255) NOT NULL,
    "generated_by" INTEGER NOT NULL,
    "generated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "acceptance_letters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" SERIAL NOT NULL,
    "admin_id" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "ip_address" VARCHAR(100),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admins_email_key" ON "admins"("email");

-- CreateIndex
CREATE UNIQUE INDEX "pins_pin_code_key" ON "pins"("pin_code");

-- CreateIndex
CREATE UNIQUE INDEX "pins_used_by_student_key" ON "pins"("used_by_student");

-- CreateIndex
CREATE UNIQUE INDEX "students_application_number_key" ON "students"("application_number");

-- CreateIndex
CREATE UNIQUE INDEX "students_email_key" ON "students"("email");

-- CreateIndex
CREATE UNIQUE INDEX "students_pin_id_key" ON "students"("pin_id");

-- CreateIndex
CREATE UNIQUE INDEX "applications_student_id_key" ON "applications"("student_id");

-- CreateIndex
CREATE UNIQUE INDEX "acceptance_letters_student_id_key" ON "acceptance_letters"("student_id");

-- AddForeignKey
ALTER TABLE "pins" ADD CONSTRAINT "pins_generated_by_fkey" FOREIGN KEY ("generated_by") REFERENCES "admins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pins" ADD CONSTRAINT "pins_used_by_student_fkey" FOREIGN KEY ("used_by_student") REFERENCES "students"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_pin_id_fkey" FOREIGN KEY ("pin_id") REFERENCES "pins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_programme_id_fkey" FOREIGN KEY ("programme_id") REFERENCES "programmes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interviews" ADD CONSTRAINT "interviews_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interviews" ADD CONSTRAINT "interviews_scheduled_by_fkey" FOREIGN KEY ("scheduled_by") REFERENCES "admins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "uploaded_documents" ADD CONSTRAINT "uploaded_documents_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "acceptance_letters" ADD CONSTRAINT "acceptance_letters_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "acceptance_letters" ADD CONSTRAINT "acceptance_letters_generated_by_fkey" FOREIGN KEY ("generated_by") REFERENCES "admins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "admins"("id") ON DELETE CASCADE ON UPDATE CASCADE;
