/*
  Warnings:

  - You are about to drop the column `screeningId` on the `Seat` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Seat" DROP CONSTRAINT "Seat_screeningId_fkey";

-- AlterTable
ALTER TABLE "Seat" DROP COLUMN "screeningId";
