ALTER TABLE "quiz_questions" ADD COLUMN "correctAnswerIndex" INTEGER;

WITH option_positions AS (
  SELECT
    qo."questionId" AS "questionId",
    qo.id AS "optionId",
    ROW_NUMBER() OVER (
      PARTITION BY qo."questionId"
      ORDER BY qo."createdAt" ASC, qo.id ASC
    ) - 1 AS "optionIndex"
  FROM "quiz_options" qo
)
UPDATE "quiz_questions" q
SET "correctAnswerIndex" = op."optionIndex"
FROM option_positions op
WHERE q.id = op."questionId"
  AND q."correctOptionId" = op."optionId";

UPDATE "quiz_questions"
SET "correctAnswerIndex" = COALESCE("correctAnswerIndex", 0);

ALTER TABLE "quiz_questions"
ALTER COLUMN "correctAnswerIndex" SET NOT NULL;

ALTER TABLE "quiz_questions" DROP COLUMN "correctOptionId";
