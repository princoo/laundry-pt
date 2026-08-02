-- CreateEnum
CREATE TYPE "AlertEventLevel" AS ENUM ('PICKUP_OVERDUE', 'RETURN_OVERDUE', 'AT_RISK', 'DEADLINE_MISSED');

-- CreateTable
CREATE TABLE "request_alert_events" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "level" "AlertEventLevel" NOT NULL,
    "detectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "request_alert_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "request_alert_events_requestId_level_key" ON "request_alert_events"("requestId", "level");

-- AddForeignKey
ALTER TABLE "request_alert_events" ADD CONSTRAINT "request_alert_events_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;
