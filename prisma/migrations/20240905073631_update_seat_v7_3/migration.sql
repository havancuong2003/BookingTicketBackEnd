-- AlterTable
CREATE SEQUENCE seat_seatid_seq;
ALTER TABLE "Seat" ALTER COLUMN "seatId" SET DEFAULT nextval('seat_seatid_seq');
ALTER SEQUENCE seat_seatid_seq OWNED BY "Seat"."seatId";
