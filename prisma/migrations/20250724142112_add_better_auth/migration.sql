/*
  Warnings:

  - You are about to drop the column `image` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "image";

-- CreateTable
CREATE TABLE "Candidate" (
    "id" TEXT NOT NULL,
    "emailCandidate" TEXT NOT NULL,
    "emailReferent" TEXT NOT NULL,
    "codeValidation" BOOLEAN NOT NULL DEFAULT true,
    "emailVerified" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "endedAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Candidate_pkey" PRIMARY KEY ("id")
);
