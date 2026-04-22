-- CreateEnum
CREATE TYPE "RenderJobStatus" AS ENUM ('QUEUED', 'RUNNING', 'SUCCEEDED', 'FAILED');

-- CreateTable
CREATE TABLE "render_jobs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "videoId" TEXT NOT NULL,
    "templateId" TEXT,
    "status" "RenderJobStatus" NOT NULL DEFAULT 'QUEUED',
    "error" TEXT,
    "resultKey" TEXT,
    "resultUrl" TEXT,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "render_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "render_jobs_userId_idx" ON "render_jobs"("userId");

-- CreateIndex
CREATE INDEX "render_jobs_videoId_idx" ON "render_jobs"("videoId");

-- CreateIndex
CREATE INDEX "render_jobs_status_idx" ON "render_jobs"("status");

-- AddForeignKey
ALTER TABLE "render_jobs" ADD CONSTRAINT "render_jobs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "render_jobs" ADD CONSTRAINT "render_jobs_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "videos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
