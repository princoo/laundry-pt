-- AlterTable
ALTER TABLE "request_notes" ADD COLUMN     "authorId" TEXT;

-- AddForeignKey
ALTER TABLE "request_notes" ADD CONSTRAINT "request_notes_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
