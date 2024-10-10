/*
  Warnings:

  - You are about to drop the column `bookingComboId` on the `PaymentDetail` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "PaymentDetail" DROP CONSTRAINT "PaymentDetail_bookingComboId_fkey";

-- AlterTable
ALTER TABLE "BookingCombo" ADD COLUMN     "paymentId" INTEGER;

-- AlterTable
ALTER TABLE "PaymentDetail" DROP COLUMN "bookingComboId";

-- AddForeignKey
ALTER TABLE "BookingCombo" ADD CONSTRAINT "BookingCombo_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("paymentId") ON DELETE SET NULL ON UPDATE CASCADE;
