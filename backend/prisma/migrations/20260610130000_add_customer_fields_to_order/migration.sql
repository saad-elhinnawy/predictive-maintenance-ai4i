-- AlterTable: make userId optional and add customer contact fields
ALTER TABLE "orders" ALTER COLUMN "userId" DROP NOT NULL;

ALTER TABLE "orders"
  ADD COLUMN IF NOT EXISTS "customerName"  TEXT,
  ADD COLUMN IF NOT EXISTS "customerEmail" TEXT,
  ADD COLUMN IF NOT EXISTS "customerPhone" TEXT;
