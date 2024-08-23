/*
  Warnings:

  - You are about to drop the `Trailer` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[trailerId]` on the table `Movie` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Trailer" DROP CONSTRAINT "Trailer_movieId_fkey";

-- AlterTable
ALTER TABLE "Movie" ADD COLUMN     "trailer" TEXT,
ADD COLUMN     "trailerId" INTEGER;

-- DropTable
DROP TABLE "Trailer";

-- CreateIndex
CREATE UNIQUE INDEX "Movie_trailerId_key" ON "Movie"("trailerId");
