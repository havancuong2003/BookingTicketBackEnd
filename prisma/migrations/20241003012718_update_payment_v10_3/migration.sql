-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "screeningId" INTEGER;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_screeningId_fkey" FOREIGN KEY ("screeningId") REFERENCES "Screening"("screeningId") ON DELETE SET NULL ON UPDATE CASCADE;
