-- CreateEnum
CREATE TYPE "FuelType" AS ENUM ('PETROL', 'DIESEL', 'HYBRID', 'ELECTRIC');

-- CreateEnum
CREATE TYPE "Transmission" AS ENUM ('AUTOMATIC', 'MANUAL');

-- CreateEnum
CREATE TYPE "ListingStatus" AS ENUM ('AVAILABLE', 'RESERVED', 'SOLD');

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "listingId" TEXT;

-- CreateTable
CREATE TABLE "car_listings" (
    "id" TEXT NOT NULL,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "mileage" INTEGER NOT NULL DEFAULT 0,
    "condition" TEXT NOT NULL DEFAULT 'NEW',
    "fuelType" "FuelType" NOT NULL,
    "transmission" "Transmission" NOT NULL,
    "power" INTEGER,
    "engineSize" DOUBLE PRECISION,
    "color" TEXT,
    "bodyType" TEXT,
    "photos" JSONB NOT NULL,
    "basePrice" DOUBLE PRECISION NOT NULL,
    "shippingCost" DOUBLE PRECISION NOT NULL DEFAULT 1200,
    "taxRate" DOUBLE PRECISION NOT NULL DEFAULT 0.14,
    "customsRate" DOUBLE PRECISION NOT NULL DEFAULT 0.05,
    "status" "ListingStatus" NOT NULL DEFAULT 'AVAILABLE',
    "sourceUrl" TEXT,
    "sourceSite" TEXT DEFAULT 'mobile.de',
    "features" JSONB,
    "mjPrompt" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "car_listings_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "car_listings"("id") ON DELETE SET NULL ON UPDATE CASCADE;
