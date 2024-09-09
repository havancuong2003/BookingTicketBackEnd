-- CreateTable
CREATE TABLE "Seat" (
    "seatId" SERIAL NOT NULL,
    "roomId" INTEGER,
    "screeningId" INTEGER,
    "seatNumber" INTEGER,
    "rowCode" TEXT,
    "seatType" TEXT,
    "status" INTEGER,

    CONSTRAINT "Seat_pkey" PRIMARY KEY ("seatId")
);

-- AddForeignKey
ALTER TABLE "Seat" ADD CONSTRAINT "Seat_screeningId_fkey" FOREIGN KEY ("screeningId") REFERENCES "Screening"("screeningId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Seat" ADD CONSTRAINT "Seat_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("roomId") ON DELETE SET NULL ON UPDATE CASCADE;
