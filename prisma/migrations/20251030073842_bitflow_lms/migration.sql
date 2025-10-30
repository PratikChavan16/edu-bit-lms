/*
  Warnings:

  - You are about to drop the column `resource` on the `audit_logs` table. All the data in the column will be lost.
  - You are about to drop the column `resourceId` on the `audit_logs` table. All the data in the column will be lost.
  - You are about to drop the column `active` on the `courses` table. All the data in the column will be lost.
  - You are about to drop the column `instructorId` on the `courses` table. All the data in the column will be lost.
  - You are about to drop the column `permissions` on the `roles` table. All the data in the column will be lost.
  - You are about to drop the column `active` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `avatar` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `emailVerified` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `tenants` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[departmentId,code]` on the table `courses` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `roles` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `entityType` to the `audit_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `universityId` to the `audit_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `collegeId` to the `courses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `universityId` to the `courses` table without a default value. This is not possible if the table is not empty.
  - Made the column `departmentId` on table `courses` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `academicYearId` to the `enrollments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `level` to the `roles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scope` to the `roles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `roles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `passwordHash` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `universityId` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "tenant"."courses_code_key";

-- DropIndex
DROP INDEX "tenant"."roles_name_key";

-- AlterTable
ALTER TABLE "tenant"."audit_logs" DROP COLUMN "resource",
DROP COLUMN "resourceId",
ADD COLUMN     "entityId" TEXT,
ADD COLUMN     "entityType" TEXT NOT NULL,
ADD COLUMN     "universityId" TEXT NOT NULL,
ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "tenant"."courses" DROP COLUMN "active",
DROP COLUMN "instructorId",
ADD COLUMN     "collegeId" TEXT NOT NULL,
ADD COLUMN     "level" TEXT,
ADD COLUMN     "prerequisites" JSONB,
ADD COLUMN     "semester" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'active',
ADD COLUMN     "syllabusUrl" TEXT,
ADD COLUMN     "universityId" TEXT NOT NULL,
ALTER COLUMN "departmentId" SET NOT NULL;

-- AlterTable
ALTER TABLE "tenant"."enrollments" ADD COLUMN     "academicYearId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "tenant"."roles" DROP COLUMN "permissions",
ADD COLUMN     "level" INTEGER NOT NULL,
ADD COLUMN     "scope" TEXT NOT NULL,
ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "tenant"."users" DROP COLUMN "active",
DROP COLUMN "avatar",
DROP COLUMN "emailVerified",
DROP COLUMN "password",
DROP COLUMN "role",
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "emailVerifiedAt" TIMESTAMP(3),
ADD COLUMN     "passwordHash" TEXT NOT NULL,
ADD COLUMN     "photoUrl" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'active',
ADD COLUMN     "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "universityId" TEXT NOT NULL,
ADD COLUMN     "username" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."tenants";

-- CreateTable
CREATE TABLE "public"."universities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "subdomain" TEXT NOT NULL,
    "domain" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "establishedYear" INTEGER,
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "status" TEXT NOT NULL DEFAULT 'setup',
    "storageQuotaGb" INTEGER NOT NULL DEFAULT 1000,
    "storageUsedMb" BIGINT NOT NULL DEFAULT 0,
    "branding" JSONB,
    "settings" JSONB,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "universities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant"."permissions" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant"."role_user" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedBy" TEXT,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "role_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant"."role_permissions" (
    "id" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant"."sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "lastActivityAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant"."colleges" (
    "id" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "type" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "establishedYear" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'active',
    "capacity" INTEGER,
    "currentEnrollment" INTEGER NOT NULL DEFAULT 0,
    "accreditation" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "colleges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant"."departments" (
    "id" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    "collegeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "headFacultyId" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "floorLocation" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant"."academic_years" (
    "id" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "isCurrent" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'upcoming',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "academic_years_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant"."students" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    "collegeId" TEXT NOT NULL,
    "departmentId" TEXT,
    "admissionNumber" TEXT NOT NULL,
    "admissionDate" TIMESTAMP(3) NOT NULL,
    "course" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "section" TEXT,
    "rollNumber" TEXT,
    "bloodGroup" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "gender" TEXT,
    "nationality" TEXT,
    "emergencyContact" JSONB,
    "guardianName" TEXT,
    "guardianPhone" TEXT,
    "guardianEmail" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant"."faculty" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    "collegeId" TEXT NOT NULL,
    "departmentId" TEXT,
    "employeeId" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "qualification" TEXT,
    "specialization" TEXT,
    "experienceYears" INTEGER,
    "employmentType" TEXT,
    "joiningDate" TIMESTAMP(3),
    "salary" DECIMAL(12,2),
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "faculty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant"."staff" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    "collegeId" TEXT,
    "employeeId" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "departmentName" TEXT,
    "employmentType" TEXT,
    "joiningDate" TIMESTAMP(3),
    "salary" DECIMAL(12,2),
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant"."fee_structures" (
    "id" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    "collegeId" TEXT NOT NULL,
    "academicYearId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "course" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "installments" INTEGER NOT NULL DEFAULT 1,
    "dueDates" JSONB,
    "lateFeePerDay" DECIMAL(8,2) NOT NULL DEFAULT 0,
    "components" JSONB,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fee_structures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant"."fee_payments" (
    "id" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "feeStructureId" TEXT NOT NULL,
    "amountPaid" DECIMAL(12,2) NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paymentMethod" TEXT NOT NULL,
    "transactionId" TEXT,
    "receiptNumber" TEXT NOT NULL,
    "installmentNumber" INTEGER,
    "lateFee" DECIMAL(8,2) NOT NULL DEFAULT 0,
    "remarks" TEXT,
    "status" TEXT NOT NULL DEFAULT 'completed',
    "recordedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fee_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant"."invoices" (
    "id" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    "invoiceNumber" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "issueDate" TIMESTAMP(3) NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "totalAmount" DECIMAL(12,2) NOT NULL,
    "taxAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "discountAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "paidAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "lineItems" JSONB,
    "status" TEXT NOT NULL DEFAULT 'unpaid',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant"."notifications" (
    "id" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "actionUrl" TEXT,
    "icon" TEXT,
    "priority" TEXT NOT NULL DEFAULT 'normal',
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "channels" JSONB,
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant"."file_uploads" (
    "id" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    "uploadedBy" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "originalFilename" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "fileSizeBytes" BIGINT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "category" TEXT,
    "entityType" TEXT,
    "entityId" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "downloadCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "file_uploads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant"."settings" (
    "id" TEXT NOT NULL,
    "universityId" TEXT,
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "dataType" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant"."announcements" (
    "id" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    "collegeId" TEXT,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "targetAudience" TEXT NOT NULL,
    "attachmentUrls" JSONB,
    "priority" TEXT NOT NULL DEFAULT 'normal',
    "publishedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "createdBy" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "announcements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant"."complaint_tickets" (
    "id" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    "ticketNumber" TEXT NOT NULL,
    "raisedBy" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'normal',
    "status" TEXT NOT NULL DEFAULT 'open',
    "assignedTo" TEXT,
    "resolution" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "complaint_tickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant"."conversations" (
    "id" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant"."conversation_participants" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'member',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leftAt" TIMESTAMP(3),

    CONSTRAINT "conversation_participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant"."messages" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "messageType" TEXT NOT NULL DEFAULT 'text',
    "attachments" JSONB,
    "isEdited" BOOLEAN NOT NULL DEFAULT false,
    "editedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant"."message_reads" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "readAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "message_reads_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "universities_slug_key" ON "public"."universities"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "universities_subdomain_key" ON "public"."universities"("subdomain");

-- CreateIndex
CREATE UNIQUE INDEX "universities_domain_key" ON "public"."universities"("domain");

-- CreateIndex
CREATE INDEX "universities_slug_idx" ON "public"."universities"("slug");

-- CreateIndex
CREATE INDEX "universities_status_idx" ON "public"."universities"("status");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_slug_key" ON "tenant"."permissions"("slug");

-- CreateIndex
CREATE INDEX "permissions_slug_idx" ON "tenant"."permissions"("slug");

-- CreateIndex
CREATE INDEX "permissions_resource_idx" ON "tenant"."permissions"("resource");

-- CreateIndex
CREATE INDEX "role_user_userId_idx" ON "tenant"."role_user"("userId");

-- CreateIndex
CREATE INDEX "role_user_roleId_idx" ON "tenant"."role_user"("roleId");

-- CreateIndex
CREATE UNIQUE INDEX "role_user_userId_roleId_key" ON "tenant"."role_user"("userId", "roleId");

-- CreateIndex
CREATE INDEX "role_permissions_roleId_idx" ON "tenant"."role_permissions"("roleId");

-- CreateIndex
CREATE INDEX "role_permissions_permissionId_idx" ON "tenant"."role_permissions"("permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "role_permissions_roleId_permissionId_key" ON "tenant"."role_permissions"("roleId", "permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_refreshToken_key" ON "tenant"."sessions"("refreshToken");

-- CreateIndex
CREATE INDEX "sessions_userId_idx" ON "tenant"."sessions"("userId");

-- CreateIndex
CREATE INDEX "sessions_refreshToken_idx" ON "tenant"."sessions"("refreshToken");

-- CreateIndex
CREATE INDEX "colleges_universityId_idx" ON "tenant"."colleges"("universityId");

-- CreateIndex
CREATE INDEX "colleges_status_idx" ON "tenant"."colleges"("status");

-- CreateIndex
CREATE UNIQUE INDEX "colleges_universityId_code_key" ON "tenant"."colleges"("universityId", "code");

-- CreateIndex
CREATE INDEX "departments_universityId_idx" ON "tenant"."departments"("universityId");

-- CreateIndex
CREATE INDEX "departments_collegeId_idx" ON "tenant"."departments"("collegeId");

-- CreateIndex
CREATE UNIQUE INDEX "departments_collegeId_code_key" ON "tenant"."departments"("collegeId", "code");

-- CreateIndex
CREATE INDEX "academic_years_universityId_idx" ON "tenant"."academic_years"("universityId");

-- CreateIndex
CREATE INDEX "academic_years_isCurrent_idx" ON "tenant"."academic_years"("isCurrent");

-- CreateIndex
CREATE UNIQUE INDEX "academic_years_universityId_name_key" ON "tenant"."academic_years"("universityId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "students_userId_key" ON "tenant"."students"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "students_admissionNumber_key" ON "tenant"."students"("admissionNumber");

-- CreateIndex
CREATE INDEX "students_universityId_idx" ON "tenant"."students"("universityId");

-- CreateIndex
CREATE INDEX "students_collegeId_idx" ON "tenant"."students"("collegeId");

-- CreateIndex
CREATE INDEX "students_departmentId_idx" ON "tenant"."students"("departmentId");

-- CreateIndex
CREATE INDEX "students_status_idx" ON "tenant"."students"("status");

-- CreateIndex
CREATE UNIQUE INDEX "faculty_userId_key" ON "tenant"."faculty"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "faculty_employeeId_key" ON "tenant"."faculty"("employeeId");

-- CreateIndex
CREATE INDEX "faculty_universityId_idx" ON "tenant"."faculty"("universityId");

-- CreateIndex
CREATE INDEX "faculty_collegeId_idx" ON "tenant"."faculty"("collegeId");

-- CreateIndex
CREATE INDEX "faculty_departmentId_idx" ON "tenant"."faculty"("departmentId");

-- CreateIndex
CREATE INDEX "faculty_status_idx" ON "tenant"."faculty"("status");

-- CreateIndex
CREATE UNIQUE INDEX "staff_userId_key" ON "tenant"."staff"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "staff_employeeId_key" ON "tenant"."staff"("employeeId");

-- CreateIndex
CREATE INDEX "staff_universityId_idx" ON "tenant"."staff"("universityId");

-- CreateIndex
CREATE INDEX "staff_collegeId_idx" ON "tenant"."staff"("collegeId");

-- CreateIndex
CREATE INDEX "staff_status_idx" ON "tenant"."staff"("status");

-- CreateIndex
CREATE INDEX "fee_structures_universityId_idx" ON "tenant"."fee_structures"("universityId");

-- CreateIndex
CREATE INDEX "fee_structures_collegeId_idx" ON "tenant"."fee_structures"("collegeId");

-- CreateIndex
CREATE INDEX "fee_structures_academicYearId_idx" ON "tenant"."fee_structures"("academicYearId");

-- CreateIndex
CREATE UNIQUE INDEX "fee_payments_transactionId_key" ON "tenant"."fee_payments"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "fee_payments_receiptNumber_key" ON "tenant"."fee_payments"("receiptNumber");

-- CreateIndex
CREATE INDEX "fee_payments_universityId_idx" ON "tenant"."fee_payments"("universityId");

-- CreateIndex
CREATE INDEX "fee_payments_studentId_idx" ON "tenant"."fee_payments"("studentId");

-- CreateIndex
CREATE INDEX "fee_payments_feeStructureId_idx" ON "tenant"."fee_payments"("feeStructureId");

-- CreateIndex
CREATE INDEX "fee_payments_status_idx" ON "tenant"."fee_payments"("status");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_invoiceNumber_key" ON "tenant"."invoices"("invoiceNumber");

-- CreateIndex
CREATE INDEX "invoices_universityId_idx" ON "tenant"."invoices"("universityId");

-- CreateIndex
CREATE INDEX "invoices_status_idx" ON "tenant"."invoices"("status");

-- CreateIndex
CREATE INDEX "invoices_entityType_entityId_idx" ON "tenant"."invoices"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "notifications_universityId_idx" ON "tenant"."notifications"("universityId");

-- CreateIndex
CREATE INDEX "notifications_userId_idx" ON "tenant"."notifications"("userId");

-- CreateIndex
CREATE INDEX "notifications_isRead_idx" ON "tenant"."notifications"("isRead");

-- CreateIndex
CREATE INDEX "file_uploads_universityId_idx" ON "tenant"."file_uploads"("universityId");

-- CreateIndex
CREATE INDEX "file_uploads_uploadedBy_idx" ON "tenant"."file_uploads"("uploadedBy");

-- CreateIndex
CREATE INDEX "file_uploads_entityType_entityId_idx" ON "tenant"."file_uploads"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "settings_category_idx" ON "tenant"."settings"("category");

-- CreateIndex
CREATE UNIQUE INDEX "settings_universityId_key_key" ON "tenant"."settings"("universityId", "key");

-- CreateIndex
CREATE INDEX "announcements_universityId_idx" ON "tenant"."announcements"("universityId");

-- CreateIndex
CREATE INDEX "announcements_collegeId_idx" ON "tenant"."announcements"("collegeId");

-- CreateIndex
CREATE INDEX "announcements_status_idx" ON "tenant"."announcements"("status");

-- CreateIndex
CREATE UNIQUE INDEX "complaint_tickets_ticketNumber_key" ON "tenant"."complaint_tickets"("ticketNumber");

-- CreateIndex
CREATE INDEX "complaint_tickets_universityId_idx" ON "tenant"."complaint_tickets"("universityId");

-- CreateIndex
CREATE INDEX "complaint_tickets_status_idx" ON "tenant"."complaint_tickets"("status");

-- CreateIndex
CREATE INDEX "complaint_tickets_priority_idx" ON "tenant"."complaint_tickets"("priority");

-- CreateIndex
CREATE INDEX "complaint_tickets_raisedBy_idx" ON "tenant"."complaint_tickets"("raisedBy");

-- CreateIndex
CREATE INDEX "conversations_universityId_idx" ON "tenant"."conversations"("universityId");

-- CreateIndex
CREATE INDEX "conversations_type_idx" ON "tenant"."conversations"("type");

-- CreateIndex
CREATE INDEX "conversation_participants_conversationId_idx" ON "tenant"."conversation_participants"("conversationId");

-- CreateIndex
CREATE INDEX "conversation_participants_userId_idx" ON "tenant"."conversation_participants"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "conversation_participants_conversationId_userId_key" ON "tenant"."conversation_participants"("conversationId", "userId");

-- CreateIndex
CREATE INDEX "messages_conversationId_idx" ON "tenant"."messages"("conversationId");

-- CreateIndex
CREATE INDEX "messages_senderId_idx" ON "tenant"."messages"("senderId");

-- CreateIndex
CREATE INDEX "messages_createdAt_idx" ON "tenant"."messages"("createdAt");

-- CreateIndex
CREATE INDEX "message_reads_messageId_idx" ON "tenant"."message_reads"("messageId");

-- CreateIndex
CREATE INDEX "message_reads_userId_idx" ON "tenant"."message_reads"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "message_reads_messageId_userId_key" ON "tenant"."message_reads"("messageId", "userId");

-- CreateIndex
CREATE INDEX "audit_logs_universityId_idx" ON "tenant"."audit_logs"("universityId");

-- CreateIndex
CREATE INDEX "audit_logs_userId_idx" ON "tenant"."audit_logs"("userId");

-- CreateIndex
CREATE INDEX "audit_logs_entityType_entityId_idx" ON "tenant"."audit_logs"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "audit_logs_createdAt_idx" ON "tenant"."audit_logs"("createdAt");

-- CreateIndex
CREATE INDEX "courses_universityId_idx" ON "tenant"."courses"("universityId");

-- CreateIndex
CREATE INDEX "courses_collegeId_idx" ON "tenant"."courses"("collegeId");

-- CreateIndex
CREATE INDEX "courses_departmentId_idx" ON "tenant"."courses"("departmentId");

-- CreateIndex
CREATE UNIQUE INDEX "courses_departmentId_code_key" ON "tenant"."courses"("departmentId", "code");

-- CreateIndex
CREATE INDEX "enrollments_studentId_idx" ON "tenant"."enrollments"("studentId");

-- CreateIndex
CREATE INDEX "enrollments_courseId_idx" ON "tenant"."enrollments"("courseId");

-- CreateIndex
CREATE INDEX "enrollments_academicYearId_idx" ON "tenant"."enrollments"("academicYearId");

-- CreateIndex
CREATE UNIQUE INDEX "roles_slug_key" ON "tenant"."roles"("slug");

-- CreateIndex
CREATE INDEX "roles_slug_idx" ON "tenant"."roles"("slug");

-- CreateIndex
CREATE INDEX "roles_level_idx" ON "tenant"."roles"("level");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "tenant"."users"("username");

-- CreateIndex
CREATE INDEX "users_universityId_idx" ON "tenant"."users"("universityId");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "tenant"."users"("email");

-- CreateIndex
CREATE INDEX "users_status_idx" ON "tenant"."users"("status");

-- AddForeignKey
ALTER TABLE "tenant"."role_user" ADD CONSTRAINT "role_user_userId_fkey" FOREIGN KEY ("userId") REFERENCES "tenant"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant"."role_user" ADD CONSTRAINT "role_user_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "tenant"."roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant"."role_permissions" ADD CONSTRAINT "role_permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "tenant"."roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant"."role_permissions" ADD CONSTRAINT "role_permissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "tenant"."permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant"."sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "tenant"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant"."departments" ADD CONSTRAINT "departments_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "tenant"."colleges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant"."courses" ADD CONSTRAINT "courses_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "tenant"."departments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant"."students" ADD CONSTRAINT "students_userId_fkey" FOREIGN KEY ("userId") REFERENCES "tenant"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant"."students" ADD CONSTRAINT "students_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "tenant"."colleges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant"."students" ADD CONSTRAINT "students_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "tenant"."departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant"."faculty" ADD CONSTRAINT "faculty_userId_fkey" FOREIGN KEY ("userId") REFERENCES "tenant"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant"."faculty" ADD CONSTRAINT "faculty_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "tenant"."colleges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant"."faculty" ADD CONSTRAINT "faculty_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "tenant"."departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant"."staff" ADD CONSTRAINT "staff_userId_fkey" FOREIGN KEY ("userId") REFERENCES "tenant"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant"."staff" ADD CONSTRAINT "staff_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "tenant"."colleges"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant"."enrollments" ADD CONSTRAINT "enrollments_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "tenant"."students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant"."enrollments" ADD CONSTRAINT "enrollments_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "tenant"."courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant"."enrollments" ADD CONSTRAINT "enrollments_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES "tenant"."academic_years"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant"."fee_structures" ADD CONSTRAINT "fee_structures_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "tenant"."colleges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant"."fee_structures" ADD CONSTRAINT "fee_structures_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES "tenant"."academic_years"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant"."fee_payments" ADD CONSTRAINT "fee_payments_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "tenant"."students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant"."fee_payments" ADD CONSTRAINT "fee_payments_feeStructureId_fkey" FOREIGN KEY ("feeStructureId") REFERENCES "tenant"."fee_structures"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant"."conversation_participants" ADD CONSTRAINT "conversation_participants_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "tenant"."conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant"."conversation_participants" ADD CONSTRAINT "conversation_participants_userId_fkey" FOREIGN KEY ("userId") REFERENCES "tenant"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant"."messages" ADD CONSTRAINT "messages_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "tenant"."conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant"."messages" ADD CONSTRAINT "messages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "tenant"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant"."message_reads" ADD CONSTRAINT "message_reads_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "tenant"."messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant"."message_reads" ADD CONSTRAINT "message_reads_userId_fkey" FOREIGN KEY ("userId") REFERENCES "tenant"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
