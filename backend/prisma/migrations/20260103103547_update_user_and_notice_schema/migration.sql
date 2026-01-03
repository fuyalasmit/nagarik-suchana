/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `notices` table. All the data in the column will be lost.
  - You are about to drop the column `issuingAgency` on the `notices` table. All the data in the column will be lost.
  - You are about to drop the column `level` on the `notices` table. All the data in the column will be lost.
  - You are about to drop the column `pdfUrl` on the `notices` table. All the data in the column will be lost.
  - You are about to drop the column `sector` on the `notices` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "notices" DROP COLUMN "imageUrl",
DROP COLUMN "issuingAgency",
DROP COLUMN "level",
DROP COLUMN "pdfUrl",
DROP COLUMN "sector",
ADD COLUMN     "profession" TEXT;
