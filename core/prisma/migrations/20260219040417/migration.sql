/*
  Warnings:

  - Made the column `name` on table `videos` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "videos" ALTER COLUMN "name" SET NOT NULL;
