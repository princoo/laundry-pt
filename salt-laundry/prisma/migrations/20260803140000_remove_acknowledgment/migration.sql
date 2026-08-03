-- Acknowledgment is retired: collecting a request is the acknowledgment, and
-- only a supervisor or admin may move a request away from its assignee.
ALTER TABLE "requests" DROP COLUMN "acknowledgedAt";
