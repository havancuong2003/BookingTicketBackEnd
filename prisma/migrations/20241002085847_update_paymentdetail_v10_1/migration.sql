/*
  Warnings:

  - The primary key for the `PaymentDetail` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `PaymentDetail` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PaymentDetail" DROP CONSTRAINT "PaymentDetail_pkey",
DROP COLUMN "id",
ADD COLUMN     "paymentDetailId" SERIAL NOT NULL,
ADD CONSTRAINT "PaymentDetail_pkey" PRIMARY KEY ("paymentDetailId");
