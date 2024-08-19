/*
  Warnings:

  - You are about to drop the column `referenceToken` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "referenceToken",
ADD COLUMN     "refreshToken" TEXT;
