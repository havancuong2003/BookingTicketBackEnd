-- CreateTable
CREATE TABLE "BookingCombo" (
    "bookingComboId" SERIAL NOT NULL,
    "comboId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "BookingCombo_pkey" PRIMARY KEY ("bookingComboId")
);

-- AddForeignKey
ALTER TABLE "BookingCombo" ADD CONSTRAINT "BookingCombo_comboId_fkey" FOREIGN KEY ("comboId") REFERENCES "Combo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
