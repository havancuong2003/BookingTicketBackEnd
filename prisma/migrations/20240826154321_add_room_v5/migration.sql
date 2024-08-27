/*
  Warnings:

  - Made the column `createdAt` on table `Cinema` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `Cinema` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Cinema" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET NOT NULL;

-- CreateTable
CREATE TABLE "Room" (
    "roomId" SERIAL NOT NULL,
    "roomCode" TEXT,
    "cinemaId" INTEGER,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("roomId")
);

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_cinemaId_fkey" FOREIGN KEY ("cinemaId") REFERENCES "Cinema"("cinemaId") ON DELETE SET NULL ON UPDATE CASCADE;
