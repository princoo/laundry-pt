-- CreateIndex
CREATE INDEX "request_items_requestId_idx" ON "request_items"("requestId");

-- CreateIndex
CREATE INDEX "request_items_laundryItemId_idx" ON "request_items"("laundryItemId");

-- CreateIndex
CREATE INDEX "request_notes_requestId_idx" ON "request_notes"("requestId");

-- CreateIndex
CREATE INDEX "request_notes_authorId_idx" ON "request_notes"("authorId");

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
