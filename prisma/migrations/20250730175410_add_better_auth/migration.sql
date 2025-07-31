/*
  Warnings:

  - You are about to drop the column `image` on the `user` table. All the data in the column will be lost.
  - The `emailVerified` column on the `user` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `name` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "image",
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "createdAt" DROP DEFAULT,
DROP COLUMN "emailVerified",
ADD COLUMN     "emailVerified" BOOLEAN;
