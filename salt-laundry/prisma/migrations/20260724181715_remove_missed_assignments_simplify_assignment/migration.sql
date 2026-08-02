-- DropForeignKey
ALTER TABLE "missed_assignments" DROP CONSTRAINT "missed_assignments_requestId_fkey";

-- DropForeignKey
ALTER TABLE "missed_assignments" DROP CONSTRAINT "missed_assignments_userId_fkey";

-- DropTable
DROP TABLE "missed_assignments";

