-- CreateEnum
CREATE TYPE "AssignmentMethod" AS ENUM ('AUTO', 'MANUAL');

-- AlterTable
ALTER TABLE "requests" ADD COLUMN     "assignmentMethod" "AssignmentMethod",
ADD COLUMN     "unassignedAt" TIMESTAMP(3),
ADD COLUMN     "unassignedFromId" TEXT;

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_unassignedFromId_fkey" FOREIGN KEY ("unassignedFromId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
