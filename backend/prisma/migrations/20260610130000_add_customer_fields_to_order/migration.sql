-- AlterTable: make user_id optional and add customer contact fields
ALTER TABLE "orders" ALTER COLUMN "user_id" DROP NOT NULL;

ALTER TABLE "orders"
  ADD COLUMN "customer_name"  TEXT,
  ADD COLUMN "customer_email" TEXT,
  ADD COLUMN "customer_phone" TEXT;
