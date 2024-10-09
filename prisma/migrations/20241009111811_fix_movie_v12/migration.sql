/*
  Warnings:

  - The `status` column on the `Movie` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "MovieStatus" AS ENUM ('COMING_SOON', 'NOW_SHOWING', 'ENDED', 'HIDDEN');

-- AlterTable
ALTER TABLE "Movie" DROP COLUMN "status",
ADD COLUMN     "status" "MovieStatus";
