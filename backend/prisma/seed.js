'use strict';
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// All prices are base purchase prices in EUR (from German dealers).
// Final import price = base + shipping + duties(14%) + customs(5%) + markup(30%)
const LISTINGS = [
  {
    make: 'Mercedes-Benz', model: 'S 500 4MATIC', year: 2025,
    mileage: 0, condition: 'NEW', fuelType: 'PETROL', transmission: 'AUTOMATIC',
    power: 449, engineSize: 3.0, color: 'Obsidian Black Metallic', bodyType: 'Sedan',
    basePrice: 95950, shippingCost: 1400, taxRate: 0.14, customsRate: 0.05,
    status: 'AVAILABLE',
    photos: [
      'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&h=500&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=500&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&h=500&fit=crop&auto=format&q=80',
    ],
    features: [
      'Rear Executive Lounge Seats', 'Burmester® 4D Surround Sound', 'MBUX Hyperscreen',
      'Night Vision Assistant', 'Augmented Reality Head-Up Display', 'Rear Axle Steering',
      'Magic Body Control Suspension', '360° Camera System', 'Energizing Comfort Package',
    ],
    sourceSite: 'mobile.de',
    mjPrompt: 'Obsidian Black Metallic 2025 Mercedes-Benz S 500 4MATIC parked inside an upscale automotive showroom, dramatic low-key studio lighting, white marble floors, EuroDriveEgypt logo subtly blurred on dark wall in background, cinematic depth of field, professional car photography, ultra-realistic, 16:9',
  },
  {
    make: 'Mercedes-Benz', model: 'GLE 450 d 4MATIC', year: 2025,
    mileage: 0, condition: 'NEW', fuelType: 'DIESEL', transmission: 'AUTOMATIC',
    power: 367, engineSize: 3.0, color: 'Polar White', bodyType: 'SUV',
    basePrice: 82150, shippingCost: 1400, taxRate: 0.14, customsRate: 0.05,
    status: 'AVAILABLE',
    photos: [
      'https://images.unsplash.com/photo-1567818735868-e71b99932e29?w=800&h=500&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=800&h=500&fit=crop&auto=format&q=80',
    ],
    features: [
      'Air Body Control Suspension', '360° Camera', 'Burmester® Surround Sound',
      '64-Color Ambient Lighting', 'Trailer Assist', 'E-Active Body Control',
      'Hands-Free Access', 'MBUX with Navigation', 'Head-Up Display',
    ],
    sourceSite: 'mobile.de',
    mjPrompt: 'Polar White 2025 Mercedes-Benz GLE 450 d SUV inside a premium car showroom, soft overhead lighting, light grey epoxy floor, EuroDriveEgypt logo blurred on background wall, three-quarter front view, professional automotive photography, photorealistic, 16:9',
  },
  {
    make: 'BMW', model: '750e M Sport xDrive', year: 2025,
    mileage: 0, condition: 'NEW', fuelType: 'HYBRID', transmission: 'AUTOMATIC',
    power: 490, engineSize: 3.0, color: 'Carbon Black Metallic', bodyType: 'Sedan',
    basePrice: 108200, shippingCost: 1400, taxRate: 0.14, customsRate: 0.05,
    status: 'AVAILABLE',
    photos: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=500&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1543465077-db45d34b88a5?w=800&h=500&fit=crop&auto=format&q=80',
    ],
    features: [
      'BMW Theatre Screen (31.3")', 'Executive Lounge Seating', 'Bowers & Wilkins 4D Sound',
      'Panoramic Sky Lounge Roof', 'BMW Automated Parking', 'Driving Assistant Professional',
      'M Sport Package', 'Gesture Control', 'Massage Seats Front & Rear',
    ],
    sourceSite: 'mobile.de',
    mjPrompt: 'Carbon Black Metallic 2025 BMW 750e M Sport in a luxurious showroom with dramatic side lighting, dark reflective floor, EuroDriveEgypt logo blurred on wall behind, side profile view showing M Sport details, professional automotive photography, cinematic, 16:9',
  },
  {
    make: 'BMW', model: 'X7 M60i', year: 2025,
    mileage: 0, condition: 'NEW', fuelType: 'PETROL', transmission: 'AUTOMATIC',
    power: 530, engineSize: 4.4, color: 'Frozen Dark Silver Metallic', bodyType: 'SUV',
    basePrice: 125400, shippingCost: 1600, taxRate: 0.14, customsRate: 0.05,
    status: 'AVAILABLE',
    photos: [
      'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&h=500&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1562911791-c7a97b729ec5?w=800&h=500&fit=crop&auto=format&q=80',
    ],
    features: [
      'Sky Lounge Panoramic Glass Roof', 'Bowers & Wilkins Diamond Sound', 'Rear-Seat Entertainment',
      'Driving Assistant Professional', 'Laser Light', 'M Sport Package X',
      '22-inch M Light Alloy Wheels', 'Active Comfort Drive', 'Ambient Air Package',
    ],
    sourceSite: 'mobile.de',
    mjPrompt: 'Frozen Dark Silver Metallic 2025 BMW X7 M60i in a spacious high-end showroom, overhead spot lighting, white polished floor, EuroDriveEgypt logo tastefully blurred in background, front three-quarter view highlighting the massive kidney grille, professional car photography, hyperrealistic, 16:9',
  },
  {
    make: 'Audi', model: 'A8 L 55 TFSI quattro', year: 2025,
    mileage: 0, condition: 'NEW', fuelType: 'PETROL', transmission: 'AUTOMATIC',
    power: 340, engineSize: 3.0, color: 'Daytona Grey Pearl Effect', bodyType: 'Sedan',
    basePrice: 92300, shippingCost: 1400, taxRate: 0.14, customsRate: 0.05,
    status: 'AVAILABLE',
    photos: [
      'https://images.unsplash.com/photo-1606664515524-ed2f786a705b?w=800&h=500&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1603386329225-868f9b1ee6c9?w=800&h=500&fit=crop&auto=format&q=80',
    ],
    features: [
      'Bang & Olufsen 3D Premium Sound', 'Audi Virtual Cockpit Plus', 'Full Massage Seats',
      '360° Camera', 'HD Matrix LED Headlights', 'Predictive Active Suspension',
      'Rear Seat Package Plus', 'Night Vision Assist', 'Quattro Sport Differential',
    ],
    sourceSite: 'mobile.de',
    mjPrompt: 'Daytona Grey Pearl 2025 Audi A8 L in an elegant showroom with soft diffused lighting, light wood floor, EuroDriveEgypt logo blurred on a glass partition wall, rear three-quarter view, professional automotive photography, photorealistic, 16:9',
  },
  {
    make: 'Audi', model: 'Q8 55 TFSI e quattro', year: 2025,
    mileage: 0, condition: 'NEW', fuelType: 'HYBRID', transmission: 'AUTOMATIC',
    power: 381, engineSize: 3.0, color: 'Navarra Blue Pearl Effect', bodyType: 'SUV',
    basePrice: 89600, shippingCost: 1400, taxRate: 0.14, customsRate: 0.05,
    status: 'AVAILABLE',
    photos: [
      'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=500&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=500&fit=crop&auto=format&q=80',
    ],
    features: [
      'S Line Sport Package', 'Panoramic Sunroof', 'Bang & Olufsen Sound',
      'Audi Virtual Cockpit Plus', 'Air Suspension', 'E-Tron Charging System',
      '22-inch Audi Sport Wheels', 'Adaptive Cruise Assist', 'Ambient Lighting Package',
    ],
    sourceSite: 'mobile.de',
    mjPrompt: 'Navarra Blue Pearl 2025 Audi Q8 55 TFSI e quattro in a modern automotive showroom, blue accent lighting matching car color, dark floor, EuroDriveEgypt logo blurred on wall, front three-quarter view, professional automotive photography, cinematic, 16:9',
  },
  {
    make: 'Porsche', model: 'Cayenne S', year: 2025,
    mileage: 0, condition: 'NEW', fuelType: 'PETROL', transmission: 'AUTOMATIC',
    power: 474, engineSize: 2.9, color: 'Gentian Blue Metallic', bodyType: 'SUV',
    basePrice: 103750, shippingCost: 1400, taxRate: 0.14, customsRate: 0.05,
    status: 'AVAILABLE',
    photos: [
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&h=500&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1611016186353-9af58c69a533?w=800&h=500&fit=crop&auto=format&q=80',
    ],
    features: [
      'Sport Chrono Package', 'PASM Sport Suspension', 'Porsche InnoDrive',
      '21-inch Turbo S Wheels', 'Panoramic Roof System', 'Bose Surround Sound',
      'Sport Exhaust System', 'Lane Change Assist', 'Night Vision Assist',
    ],
    sourceSite: 'mobile.de',
    mjPrompt: 'Gentian Blue Metallic 2025 Porsche Cayenne S in a sleek Porsche-style showroom, dramatic spotlights, dark grey polished floor, EuroDriveEgypt logo blurred in background, three-quarter front view, ultra-realistic professional automotive photography, 16:9',
  },
  {
    make: 'Porsche', model: 'Panamera 4S', year: 2025,
    mileage: 0, condition: 'NEW', fuelType: 'PETROL', transmission: 'AUTOMATIC',
    power: 440, engineSize: 2.9, color: 'Jet Black Metallic', bodyType: 'Sedan',
    basePrice: 112400, shippingCost: 1400, taxRate: 0.14, customsRate: 0.05,
    status: 'AVAILABLE',
    photos: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=500&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1547744152-14d985cb937f?w=800&h=500&fit=crop&auto=format&q=80',
    ],
    features: [
      'Sport Chrono Package', 'Burmester® High-End Surround Sound', 'Sport Design Package',
      '21-inch RS Spyder Design Wheels', 'Head-Up Display', 'Porsche Active Suspension',
      'Rear Axle Steering', 'Massage Seats', 'Privacy Glass',
    ],
    sourceSite: 'mobile.de',
    mjPrompt: 'Jet Black Metallic 2025 Porsche Panamera 4S in a luxury automotive showroom, single dramatic key light casting sharp shadows, black marble floor, EuroDriveEgypt logo blurred on dark wall, side profile view, professional car photography, cinematic quality, 16:9',
  },
];

function calcFinalPrice(base, shipping, tax, customs) {
  return Math.round(base + shipping + base * (tax + customs) + base * 0.3);
}

async function main() {
  // Reseed cleanly: delete all in FK order
  await prisma.trackingEvent.deleteMany();
  await prisma.vesselPosition.deleteMany();
  await prisma.shipment.deleteMany();
  await prisma.order.deleteMany();
  await prisma.carListing.deleteMany();
  console.log('Cleared existing listings and orders.');

  // Upsert admin user
  const passwordHash = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where:  { email: 'admin@eurodrive-egypt.com' },
    update: {},
    create: { email: 'admin@eurodrive-egypt.com', passwordHash, name: 'EuroDrive Admin', role: 'ADMIN' },
  });
  console.log(`Admin: ${admin.email}`);

  // Create listings
  const created = [];
  for (const data of LISTINGS) {
    const listing = await prisma.carListing.create({ data });
    created.push(listing);
    console.log(`  Listed: ${listing.year} ${listing.make} ${listing.model} — ${calcFinalPrice(listing.basePrice, listing.shippingCost, listing.taxRate, listing.customsRate).toLocaleString('de-DE')} €`);
  }
  console.log(`\nSeeded ${created.length} listings.`);

  // Demo tracking order (uses the S 500 listing)
  const s500 = created.find(l => l.model === 'S 500 4MATIC');
  const demoOrder = await prisma.order.create({
    data: {
      customerName:  'Ahmed Hassan',
      customerEmail: 'ahmed@example.com',
      customerPhone: '+20 155 000 0001',
      listingId: s500?.id,
      carModel:  '2025 Mercedes-Benz S 500 4MATIC',
      configuration: { color: 'Obsidian Black Metallic', fuel: 'PETROL', transmission: 'AUTOMATIC', bodyType: 'Sedan', mileage: 0 },
      totalPrice: s500 ? calcFinalPrice(s500.basePrice, s500.shippingCost, s500.taxRate, s500.customsRate) : 148000,
      status: 'SHIPPING',
    },
  });

  const shipment = await prisma.shipment.create({
    data: {
      orderId: demoOrder.id,
      billOfLading: 'MAEU987654321',
      vesselImo: '9299860',
      currentMilestone: 'OCEAN_TRANSIT',
    },
  });

  await prisma.trackingEvent.createMany({
    data: [
      { shipmentId: shipment.id, milestone: 'PURCHASED',      timestamp: new Date('2026-05-01T10:00:00Z'), notes: 'Order confirmed. Payment processed successfully.' },
      { shipmentId: shipment.id, milestone: 'INLAND_TO_PORT', timestamp: new Date('2026-05-08T08:30:00Z'), notes: 'Vehicle dispatched from Stuttgart to Hamburg port.', gpsLat: 53.55, gpsLng: 9.99, vesselName: null },
      { shipmentId: shipment.id, milestone: 'LOADING',        timestamp: new Date('2026-05-14T14:00:00Z'), notes: 'Loaded onto vessel MSC GÜLSÜN at Hamburg Harbour.', gpsLat: 53.54, gpsLng: 9.98, vesselName: 'MSC GÜLSÜN' },
      { shipmentId: shipment.id, milestone: 'OCEAN_TRANSIT',  timestamp: new Date('2026-05-15T06:00:00Z'), notes: 'Vessel departed Hamburg. Estimated arrival Alexandria: 18 days.', gpsLat: 54.2, gpsLng: 8.5, vesselName: 'MSC GÜLSÜN' },
    ],
  });

  console.log(`\nDemo tracking order: ${demoOrder.id}`);
  console.log('Use this ID on the Track page to see the full shipment timeline.\n');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
