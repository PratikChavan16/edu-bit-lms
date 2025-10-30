-- AlterTable
ALTER TABLE "tenant"."audit_logs" ADD COLUMN     "isGodModeAction" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "newValues" JSONB,
ADD COLUMN     "oldValues" JSONB,
ALTER COLUMN "universityId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "tenant"."sessions" ADD COLUMN     "isValid" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "tenant"."tickets" (
    "id" TEXT NOT NULL,
    "ticketNumber" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "category" TEXT NOT NULL DEFAULT 'other',
    "status" TEXT NOT NULL DEFAULT 'open',
    "createdById" TEXT NOT NULL,
    "assignedToId" TEXT,
    "resolution" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "resolvedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant"."files" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "path" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'general',
    "uploadedById" TEXT NOT NULL,
    "universityId" TEXT,
    "relatedEntityType" TEXT,
    "relatedEntityId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "files_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tickets_ticketNumber_key" ON "tenant"."tickets"("ticketNumber");

-- CreateIndex
CREATE INDEX "tickets_universityId_idx" ON "tenant"."tickets"("universityId");

-- CreateIndex
CREATE INDEX "tickets_status_idx" ON "tenant"."tickets"("status");

-- CreateIndex
CREATE INDEX "tickets_priority_idx" ON "tenant"."tickets"("priority");

-- CreateIndex
CREATE INDEX "tickets_createdById_idx" ON "tenant"."tickets"("createdById");

-- CreateIndex
CREATE INDEX "tickets_assignedToId_idx" ON "tenant"."tickets"("assignedToId");

-- CreateIndex
CREATE INDEX "files_uploadedById_idx" ON "tenant"."files"("uploadedById");

-- CreateIndex
CREATE INDEX "files_universityId_idx" ON "tenant"."files"("universityId");

-- CreateIndex
CREATE INDEX "files_category_idx" ON "tenant"."files"("category");

-- CreateIndex
CREATE INDEX "files_relatedEntityType_relatedEntityId_idx" ON "tenant"."files"("relatedEntityType", "relatedEntityId");

-- CreateIndex
CREATE INDEX "audit_logs_isGodModeAction_idx" ON "tenant"."audit_logs"("isGodModeAction");

-- CreateIndex
CREATE INDEX "sessions_isValid_idx" ON "tenant"."sessions"("isValid");

-- AddForeignKey
ALTER TABLE "tenant"."audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "tenant"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant"."tickets" ADD CONSTRAINT "tickets_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "tenant"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant"."tickets" ADD CONSTRAINT "tickets_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "tenant"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant"."tickets" ADD CONSTRAINT "tickets_resolvedById_fkey" FOREIGN KEY ("resolvedById") REFERENCES "tenant"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant"."files" ADD CONSTRAINT "files_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "tenant"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
