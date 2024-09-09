/*
  Warnings:

  - The `seatType` column on the `Seat` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Seat" DROP COLUMN "seatType",
ADD COLUMN     "seatType" INTEGER DEFAULT 0,
ALTER COLUMN "status" SET DEFAULT 0;
