/*
  Warnings:

  - You are about to drop the column `trailerId` on the `Movie` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Movie_trailerId_key";

-- AlterTable
ALTER TABLE "Movie" DROP COLUMN "trailerId";
