-- AlterTable
ALTER TABLE "PaymentDetail" ADD COLUMN     "bookingComboId" INTEGER;

-- AddForeignKey
ALTER TABLE "PaymentDetail" ADD CONSTRAINT "PaymentDetail_bookingComboId_fkey" FOREIGN KEY ("bookingComboId") REFERENCES "BookingCombo"("bookingComboId") ON DELETE SET NULL ON UPDATE CASCADE;
