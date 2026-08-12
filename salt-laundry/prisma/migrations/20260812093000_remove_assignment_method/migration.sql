-- Assignment is manual-only now, so there is no method left to record.

-- AlterTable
ALTER TABLE "requests" DROP COLUMN "assignmentMethod";

-- DropEnum
DROP TYPE "AssignmentMethod";
