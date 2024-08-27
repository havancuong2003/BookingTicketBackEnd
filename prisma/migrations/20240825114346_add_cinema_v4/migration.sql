-- CreateTable
CREATE TABLE "Cinema" (
    "cinemaId" SERIAL NOT NULL,
    "name" TEXT,
    "location" TEXT,
    "totalScreens" INTEGER,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Cinema_pkey" PRIMARY KEY ("cinemaId")
);
