/*
  Warnings:

  - You are about to drop the column `cinemaId` on the `Screening` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Screening" DROP CONSTRAINT "Screening_cinemaId_fkey";

-- AlterTable
ALTER TABLE "Screening" DROP COLUMN "cinemaId";
