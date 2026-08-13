-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "ServiceType" AS ENUM ('NORMAL', 'DRY_CLEAN', 'PRESSING');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'COLLECTED', 'IN_PROGRESS', 'READY', 'DELIVERED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "AlertEventLevel" AS ENUM ('PICKUP_OVERDUE', 'RETURN_OVERDUE', 'AT_RISK', 'DEADLINE_MISSED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "soaId" TEXT NOT NULL,
    "staffId" TEXT,
    "firstName" TEXT,
    "secondName" TEXT,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "departmentName" TEXT,
    "roleNames" TEXT[],
    "isHousekeeper" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "laundry_items" (
    "id" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameFr" TEXT NOT NULL,
    "priceNormal" INTEGER,
    "priceDryClean" INTEGER,
    "pricePressing" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "laundry_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "requests" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "roomNumber" TEXT NOT NULL,
    "guestName" TEXT,
    "isExpress" BOOLEAN NOT NULL DEFAULT false,
    "isHanger" BOOLEAN NOT NULL DEFAULT false,
    "note" TEXT,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "grossAmount" INTEGER NOT NULL,
    "vatAmount" INTEGER NOT NULL,
    "totalAmount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "collectedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "returnedAt" TIMESTAMP(3),
    "assignedToId" TEXT,
    "assignedAt" TIMESTAMP(3),
    "unassignedFromId" TEXT,
    "unassignedAt" TIMESTAMP(3),
    "needsChanges" BOOLEAN NOT NULL DEFAULT false,
    "flaggedAt" TIMESTAMP(3),
    "flaggedById" TEXT,
    "flagReason" TEXT,

    CONSTRAINT "requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "request_items" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "laundryItemId" TEXT NOT NULL,
    "serviceType" "ServiceType" NOT NULL DEFAULT 'NORMAL',
    "quantity" INTEGER NOT NULL,
    "unitPrice" INTEGER NOT NULL,
    "subtotal" INTEGER NOT NULL,

    CONSTRAINT "request_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "request_notes" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "authorId" TEXT,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "request_notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "request_revisions" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "editedById" TEXT,
    "reason" TEXT,
    "items" JSONB NOT NULL,
    "guestName" TEXT,
    "note" TEXT,
    "isHanger" BOOLEAN NOT NULL,
    "isExpress" BOOLEAN NOT NULL,
    "grossAmount" INTEGER NOT NULL,
    "vatAmount" INTEGER NOT NULL,
    "totalAmount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "request_revisions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "request_alert_events" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "level" "AlertEventLevel" NOT NULL,
    "detectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "request_alert_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_soaId_key" ON "users"("soaId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "requests_status_createdAt_idx" ON "requests"("status", "createdAt");

-- CreateIndex
CREATE INDEX "requests_assignedToId_createdAt_idx" ON "requests"("assignedToId", "createdAt");

-- CreateIndex
CREATE INDEX "requests_createdAt_idx" ON "requests"("createdAt");

-- CreateIndex
CREATE INDEX "requests_status_returnedAt_idx" ON "requests"("status", "returnedAt");

-- CreateIndex
CREATE INDEX "requests_seq_idx" ON "requests"("seq");

-- CreateIndex
CREATE INDEX "requests_unassignedFromId_idx" ON "requests"("unassignedFromId");

-- CreateIndex
CREATE INDEX "requests_needsChanges_idx" ON "requests"("needsChanges");

-- CreateIndex
CREATE INDEX "requests_flaggedById_idx" ON "requests"("flaggedById");

-- CreateIndex
CREATE INDEX "request_items_requestId_idx" ON "request_items"("requestId");

-- CreateIndex
CREATE INDEX "request_items_laundryItemId_idx" ON "request_items"("laundryItemId");

-- CreateIndex
CREATE INDEX "request_notes_requestId_idx" ON "request_notes"("requestId");

-- CreateIndex
CREATE INDEX "request_notes_authorId_idx" ON "request_notes"("authorId");

-- CreateIndex
CREATE INDEX "request_revisions_requestId_createdAt_idx" ON "request_revisions"("requestId", "createdAt");

-- CreateIndex
CREATE INDEX "request_revisions_editedById_idx" ON "request_revisions"("editedById");

-- CreateIndex
CREATE UNIQUE INDEX "request_alert_events_requestId_level_key" ON "request_alert_events"("requestId", "level");

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_unassignedFromId_fkey" FOREIGN KEY ("unassignedFromId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_flaggedById_fkey" FOREIGN KEY ("flaggedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request_items" ADD CONSTRAINT "request_items_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request_items" ADD CONSTRAINT "request_items_laundryItemId_fkey" FOREIGN KEY ("laundryItemId") REFERENCES "laundry_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request_notes" ADD CONSTRAINT "request_notes_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request_notes" ADD CONSTRAINT "request_notes_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request_revisions" ADD CONSTRAINT "request_revisions_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request_revisions" ADD CONSTRAINT "request_revisions_editedById_fkey" FOREIGN KEY ("editedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request_alert_events" ADD CONSTRAINT "request_alert_events_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

