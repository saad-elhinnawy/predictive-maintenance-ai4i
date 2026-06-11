'use strict';
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

function calcFinalPrice(base, shipping = 1200, tax = 0.14, customs = 0.05) {
  return Math.round(base + shipping + base * (tax + customs) + base * 0.3);
}

const LISTINGS = [
  {
    make: 'BMW', model: 'M3 Competition', year: 2024,
    mileage: 0, condition: 'NEW', fuelType: 'PETROL', transmission: 'AUTOMATIC',
    power: 510, engineSize: 3.0, color: 'Isle of Man Green', bodyType: 'Sedan',
    basePrice: 89500, shippingCost: 1200, taxRate: 0.14, customsRate: 0.05,
    photos: [
      'https://picsum.photos/seed/bmw-m3-a/800/500',
      'https://picsum.photos/seed/bmw-m3-b/800/500',
      'https://picsum.photos/seed/bmw-m3-c/800/500',
    ],
    features: ['M Carbon Roof', 'M Drivers Package', 'Harman Kardon Sound', 'Laser Light', 'M Sport Brakes'],
    sourceSite: 'mobile.de',
  },
  {
    make: 'BMW', model: '5 Series 530d M Sport', year: 2024,
    mileage: 0, condition: 'NEW', fuelType: 'DIESEL', transmission: 'AUTOMATIC',
    power: 286, engineSize: 3.0, color: 'Mineral White', bodyType: 'Sedan',
    basePrice: 72000, shippingCost: 1200, taxRate: 0.14, customsRate: 0.05,
    photos: [
      'https://picsum.photos/seed/bmw-5-a/800/500',
      'https://picsum.photos/seed/bmw-5-b/800/500',
    ],
    features: ['Panoramic Roof', 'Adaptive Cruise Control', 'Parking Assistant Plus', 'Live Cockpit Pro'],
    sourceSite: 'mobile.de',
  },
  {
    make: 'BMW', model: 'X5 M60i', year: 2024,
    mileage: 0, condition: 'NEW', fuelType: 'PETROL', transmission: 'AUTOMATIC',
    power: 530, engineSize: 4.4, color: 'Sophisto Grey', bodyType: 'SUV',
    basePrice: 115000, shippingCost: 1400, taxRate: 0.14, customsRate: 0.05,
    photos: [
      'https://picsum.photos/seed/bmw-x5-a/800/500',
      'https://picsum.photos/seed/bmw-x5-b/800/500',
      'https://picsum.photos/seed/bmw-x5-c/800/500',
    ],
    features: ['M Sport Package', 'Bowers & Wilkins Sound', 'Adaptive Air Suspension', 'Night Vision', 'Laser Light'],
    sourceSite: 'mobile.de',
  },
  {
    make: 'Mercedes-Benz', model: 'C 300 4MATIC AMG Line', year: 2023,
    mileage: 8500, condition: 'USED', fuelType: 'PETROL', transmission: 'AUTOMATIC',
    power: 258, engineSize: 2.0, color: 'Obsidian Black', bodyType: 'Sedan',
    basePrice: 64500, shippingCost: 1200, taxRate: 0.14, customsRate: 0.05,
    photos: [
      'https://picsum.photos/seed/merc-c-a/800/500',
      'https://picsum.photos/seed/merc-c-b/800/500',
    ],
    features: ['AMG Line Exterior', 'Burmester Sound', 'MBUX Infotainment', 'Heated Seats', 'Digital Light'],
    sourceSite: 'mobile.de',
  },
  {
    make: 'Audi', model: 'A6 Avant 50 TDI quattro S line', year: 2023,
    mileage: 12000, condition: 'USED', fuelType: 'DIESEL', transmission: 'AUTOMATIC',
    power: 286, engineSize: 3.0, color: 'Daytona Grey', bodyType: 'Estate',
    basePrice: 78000, shippingCost: 1200, taxRate: 0.14, customsRate: 0.05,
    photos: [
      'https://picsum.photos/seed/audi-a6-a/800/500',
      'https://picsum.photos/seed/audi-a6-b/800/500',
    ],
    features: ['S Line Package', 'Matrix LED', 'Bang & Olufsen Sound', 'Virtual Cockpit Plus', 'Air Suspension'],
    sourceSite: 'mobile.de',
  },
  {
    make: 'BMW', model: 'M4 Competition Convertible', year: 2024,
    mileage: 0, condition: 'NEW', fuelType: 'PETROL', transmission: 'AUTOMATIC',
    power: 510, engineSize: 3.0, color: 'Brooklyn Grey', bodyType: 'Convertible',
    basePrice: 105000, shippingCost: 1400, taxRate: 0.14, customsRate: 0.05,
    photos: [
      'https://picsum.photos/seed/bmw-m4-conv-a/800/500',
      'https://picsum.photos/seed/bmw-m4-conv-b/800/500',
    ],
    features: ['M Carbon Roof', 'M Drivers Package', 'Adaptive Suspension', 'Laser Light', 'M Sport Exhaust'],
    sourceSite: 'mobile.de',
  },
];

async function main() {
  const passwordHash = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where:  { email: 'admin@example.com' },
    update: {},
    create: { email: 'admin@example.com', passwordHash, name: 'Admin User', role: 'ADMIN' },
  });
  console.log(`Seeded admin: ${admin.email}`);

  const customerHash = await bcrypt.hash('customer123', 12);
  const customer = await prisma.user.upsert({
    where:  { email: 'customer@example.com' },
    update: {},
    create: { email: 'customer@example.com', passwordHash: customerHash, name: 'Demo Customer', role: 'CUSTOMER' },
  });
  console.log(`Seeded customer: ${customer.email}`);

  const existingCount = await prisma.carListing.count();
  if (existingCount === 0) {
    for (const data of LISTINGS) {
      await prisma.carListing.create({ data });
    }
    console.log(`Seeded ${LISTINGS.length} car listings.`);
  }

  const existingOrder = await prisma.order.findFirst({ where: { userId: customer.id } });
  if (!existingOrder) {
    const m3 = await prisma.carListing.findFirst({ where: { make: 'BMW', model: 'M3 Competition' } });
    const totalPrice = m3
      ? calcFinalPrice(m3.basePrice, m3.shippingCost, m3.taxRate, m3.customsRate)
      : 134545;

    const order = await prisma.order.create({
      data: {
        userId:    customer.id,
        listingId: m3 ? m3.id : undefined,
        carModel:  '2024 BMW M3 Competition',
        configuration: { color: 'Isle of Man Green', fuel: 'PETROL', transmission: 'AUTOMATIC', bodyType: 'Sedan', mileage: 0 },
        totalPrice,
        status: 'SHIPPING',
      },
    });

    const shipment = await prisma.shipment.create({
      data: { orderId: order.id, billOfLading: 'MAEU123456789', vesselImo: '9299860', currentMilestone: 'OCEAN_TRANSIT' },
    });

    await prisma.trackingEvent.createMany({
      data: [
        { shipmentId: shipment.id, milestone: 'PURCHASED',      timestamp: new Date('2026-04-01T10:00:00Z'), notes: 'Order confirmed and payment processed.' },
        { shipmentId: shipment.id, milestone: 'INLAND_TO_PORT', timestamp: new Date('2026-04-10T08:30:00Z'), notes: 'Vehicle dispatched from Munich factory to Hamburg port.', gpsLat: 53.5511, gpsLng: 9.9937 },
        { shipmentId: shipment.id, milestone: 'LOADING',        timestamp: new Date('2026-04-15T14:00:00Z'), notes: 'Loaded onto vessel MAERSK ELBA at Hamburg.', gpsLat: 53.5396, gpsLng: 9.9822, vesselName: 'MAERSK ELBA' },
        { shipmentId: shipment.id, milestone: 'OCEAN_TRANSIT',  timestamp: new Date('2026-04-16T06:00:00Z'), notes: 'Vessel departed Hamburg. ETA: 28 days.', gpsLat: 54.2, gpsLng: 8.5, vesselName: 'MAERSK ELBA' },
      ],
    });
    console.log(`Seeded demo order ${order.id} with shipment and tracking events.`);
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
