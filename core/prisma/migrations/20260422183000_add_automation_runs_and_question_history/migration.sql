-- CreateEnum
CREATE TYPE "AutomationRunStatus" AS ENUM ('RUNNING', 'SUCCEEDED', 'FAILED');

-- CreateEnum
CREATE TYPE "AutomationRunStage" AS ENUM ('GENERATING_QUIZ', 'GENERATING_NARRATION', 'PERSISTING_QUIZ', 'RENDERING', 'PUBLISHING', 'COMPLETED');

-- CreateTable
CREATE TABLE "automation_runs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "niche" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "status" "AutomationRunStatus" NOT NULL DEFAULT 'RUNNING',
    "stage" "AutomationRunStage" NOT NULL DEFAULT 'GENERATING_QUIZ',
    "attempt" INTEGER NOT NULL DEFAULT 1,
    "error" TEXT,
    "quizId" TEXT,
    "videoId" TEXT,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "automation_runs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_question_history" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "niche" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "referenceKey" TEXT NOT NULL,
    "questionText" TEXT NOT NULL,
    "questionHash" TEXT NOT NULL,
    "correctAnswerText" TEXT,
    "quizQuestionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quiz_question_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "automation_runs_userId_idx" ON "automation_runs"("userId");

-- CreateIndex
CREATE INDEX "automation_runs_status_idx" ON "automation_runs"("status");

-- CreateIndex
CREATE INDEX "automation_runs_createdAt_idx" ON "automation_runs"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "quiz_question_history_userId_questionHash_key" ON "quiz_question_history"("userId", "questionHash");

-- CreateIndex
CREATE INDEX "quiz_question_history_userId_referenceKey_idx" ON "quiz_question_history"("userId", "referenceKey");

-- CreateIndex
CREATE INDEX "quiz_question_history_questionHash_idx" ON "quiz_question_history"("questionHash");

-- AddForeignKey
ALTER TABLE "automation_runs" ADD CONSTRAINT "automation_runs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_question_history" ADD CONSTRAINT "quiz_question_history_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
