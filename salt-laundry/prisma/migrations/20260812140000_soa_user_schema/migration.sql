-- The users table becomes a mirror of SOA staff profiles. Every account here
-- was created by the laundry's own sign-up, has a soaId of nothing, and cannot
-- be matched to an SOA profile- so the table is cleared and reseeded rather
-- than migrated column by column. The database is pre-launch; there is no
-- production account to preserve.
--
-- Requests and notes survive. Their references to a user are nulled first,
-- which is a state both already carry legitimately: a request that nobody has
-- been assigned, and a note written before authorship existed. The assignment
-- timestamps go with the ids so a request cannot claim it was assigned at a
-- time to nobody.
UPDATE "requests" SET
  "assignedToId" = NULL,
  "assignedAt" = NULL,
  "unassignedFromId" = NULL,
  "unassignedAt" = NULL;
UPDATE "request_notes" SET "authorId" = NULL;
DELETE FROM "users";

-- DropIndex
DROP INDEX "users_passwordResetToken_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "mustChangePassword",
DROP COLUMN "password",
DROP COLUMN "passwordResetExpiry",
DROP COLUMN "passwordResetToken",
DROP COLUMN "role",
ADD COLUMN     "departmentName" TEXT,
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "isHousekeeper" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "roleNames" TEXT[],
ADD COLUMN     "secondName" TEXT,
ADD COLUMN     "soaId" TEXT NOT NULL,
ADD COLUMN     "staffId" TEXT;

-- DropEnum
DROP TYPE "Role";

-- CreateIndex
CREATE UNIQUE INDEX "users_soaId_key" ON "users"("soaId");
