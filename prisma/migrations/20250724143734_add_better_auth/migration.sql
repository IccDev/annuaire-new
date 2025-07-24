/*
  Warnings:

  - You are about to drop the column `emailVerified` on the `Candidate` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Candidate" DROP COLUMN "emailVerified",
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;
