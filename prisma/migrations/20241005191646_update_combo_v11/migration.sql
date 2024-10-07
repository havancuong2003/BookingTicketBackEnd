-- CreateEnum
CREATE TYPE "MenuItemType" AS ENUM ('FOOD', 'DRINK');

-- CreateTable
CREATE TABLE "MenuItem" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "type" "MenuItemType" NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "image" VARCHAR(255),

    CONSTRAINT "MenuItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Combo" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "image" VARCHAR(255),

    CONSTRAINT "Combo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ComboToMenuItem" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ComboToMenuItem_AB_unique" ON "_ComboToMenuItem"("A", "B");

-- CreateIndex
CREATE INDEX "_ComboToMenuItem_B_index" ON "_ComboToMenuItem"("B");

-- AddForeignKey
ALTER TABLE "_ComboToMenuItem" ADD CONSTRAINT "_ComboToMenuItem_A_fkey" FOREIGN KEY ("A") REFERENCES "Combo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ComboToMenuItem" ADD CONSTRAINT "_ComboToMenuItem_B_fkey" FOREIGN KEY ("B") REFERENCES "MenuItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
