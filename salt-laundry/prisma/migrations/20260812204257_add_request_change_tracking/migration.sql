-- AlterTable
ALTER TABLE "requests" ADD COLUMN     "flagReason" TEXT,
ADD COLUMN     "flaggedAt" TIMESTAMP(3),
ADD COLUMN     "flaggedById" TEXT,
ADD COLUMN     "needsChanges" BOOLEAN NOT NULL DEFAULT false;

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

-- CreateIndex
CREATE INDEX "request_revisions_requestId_createdAt_idx" ON "request_revisions"("requestId", "createdAt");

-- CreateIndex
CREATE INDEX "request_revisions_editedById_idx" ON "request_revisions"("editedById");

-- CreateIndex
CREATE INDEX "requests_needsChanges_idx" ON "requests"("needsChanges");

-- CreateIndex
CREATE INDEX "requests_flaggedById_idx" ON "requests"("flaggedById");

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_flaggedById_fkey" FOREIGN KEY ("flaggedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request_revisions" ADD CONSTRAINT "request_revisions_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request_revisions" ADD CONSTRAINT "request_revisions_editedById_fkey" FOREIGN KEY ("editedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
