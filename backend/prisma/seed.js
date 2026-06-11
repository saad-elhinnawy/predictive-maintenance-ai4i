'use strict';
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function p(slug) { return `https://picsum.photos/seed/${slug}/800/500`; }
function p2(slug) { return `https://picsum.photos/seed/${slug}/800/600`; }

function mkVariants(defs) {
  return defs.map(([color, hex, s1, s2]) => ({
    color, hex,
    urls: s2 ? [p(s1), p2(s2)] : [p(s1)],
  }));
}

function ship(base) { return base >= 100000 ? 1600 : 1400; }

const LISTINGS = [
  // ─────────────────────────────── MERCEDES-BENZ ──────────────────────────────

  {
    make: 'Mercedes-Benz', model: 'GLA 200', year: 2025,
    bodyType: 'SUV', fuelType: 'PETROL', transmission: 'AUTOMATIC',
    power: 163, engineSize: 1.4, mileage: 0, condition: 'NEW',
    basePrice: 37500, taxRate: 0.14, customsRate: 0.04, status: 'AVAILABLE',
    photos: mkVariants([
      ['Mountain Grey Metallic', '#9B9B9B', 'mb-gla-gry', 'mb-gla-gry2'],
      ['Night Black', '#1A1A1A', 'mb-gla-blk'],
      ['Polar White', '#F5F5F5', 'mb-gla-wht'],
      ['Rose Gold Metallic', '#B8936A', 'mb-gla-ros'],
    ]),
    features: ['MBUX 7" Touchscreen', 'LED Headlights', 'Parking Sensors', 'Lane Keeping Assist', 'Active Brake Assist', 'Keyless Entry', 'Rear Camera', 'Heated Front Seats'],
    mjPrompt: 'Mountain Grey Metallic 2025 Mercedes-Benz GLA 200 inside a bright modern showroom, overhead soft lighting, light grey epoxy floor, EuroDrive logo blurred on wall, three-quarter front view, professional automotive photography, photorealistic, 16:9',
  },
  {
    make: 'Mercedes-Benz', model: 'GLB 200', year: 2025,
    bodyType: 'SUV', fuelType: 'PETROL', transmission: 'AUTOMATIC',
    power: 163, engineSize: 1.4, mileage: 0, condition: 'NEW',
    basePrice: 42000, taxRate: 0.14, customsRate: 0.04, status: 'AVAILABLE',
    photos: mkVariants([
      ['Polar White', '#F5F5F5', 'mb-glb-wht', 'mb-glb-wht2'],
      ['Obsidian Black Metallic', '#1C1C1C', 'mb-glb-blk'],
      ['Selenite Grey Metallic', '#9EA4A8', 'mb-glb-gry'],
    ]),
    features: ['7-Seat Option', 'MBUX 10.25" Touchscreen', 'LED Headlights', 'Parking Package', 'Active Brake Assist', 'Lane Keeping Assist', 'Keyless-Go', 'Panoramic Sunroof'],
    mjPrompt: 'Polar White 2025 Mercedes-Benz GLB 200 inside a spacious premium showroom, diffused overhead lighting, white polished floor, EuroDrive logo blurred on background, front three-quarter view, professional automotive photography, photorealistic, 16:9',
  },
  {
    make: 'Mercedes-Benz', model: 'C 200 Limousine', year: 2025,
    bodyType: 'Sedan', fuelType: 'PETROL', transmission: 'AUTOMATIC',
    power: 204, engineSize: 1.5, mileage: 0, condition: 'NEW',
    basePrice: 44100, taxRate: 0.14, customsRate: 0.04, status: 'AVAILABLE',
    photos: mkVariants([
      ['Obsidian Black Metallic', '#1C1C1C', 'mb-c200-blk', 'mb-c200-blk2'],
      ['Polar White', '#F5F5F5', 'mb-c200-wht'],
      ['Selenite Grey Metallic', '#9EA4A8', 'mb-c200-gry'],
      ['Spectral Blue Metallic', '#2D5A8E', 'mb-c200-blu'],
    ]),
    features: ['MBUX 11.9" Touchscreen', 'Digital Instrument Cluster', 'LED Headlights', 'Active Brake Assist', 'Lane Keeping Assist', 'Keyless-Go', 'Wireless Charging', 'Rear Parking Sensors'],
    mjPrompt: 'Obsidian Black Metallic 2025 Mercedes-Benz C 200 Limousine inside a modern showroom, dramatic side lighting, black marble floor, EuroDrive logo blurred on wall, side profile view, professional car photography, cinematic, 16:9',
  },
  {
    make: 'Mercedes-Benz', model: 'C 220 d Limousine', year: 2025,
    bodyType: 'Sedan', fuelType: 'DIESEL', transmission: 'AUTOMATIC',
    power: 197, engineSize: 2.0, mileage: 0, condition: 'NEW',
    basePrice: 47000, taxRate: 0.14, customsRate: 0.04, status: 'AVAILABLE',
    photos: mkVariants([
      ['Selenite Grey Metallic', '#9EA4A8', 'mb-c220d-gry', 'mb-c220d-gry2'],
      ['Polar White', '#F5F5F5', 'mb-c220d-wht'],
      ['Obsidian Black Metallic', '#1C1C1C', 'mb-c220d-blk'],
      ['Spectral Blue Metallic', '#2D5A8E', 'mb-c220d-blu'],
    ]),
    features: ['MBUX 11.9" Touchscreen', 'Digital Instrument Cluster', 'Ambient Lighting', 'LED Headlights', 'Active Brake Assist', 'Active Distance Assist', 'Burmester Sound', 'Panoramic Sunroof'],
    mjPrompt: 'Selenite Grey Metallic 2025 Mercedes-Benz C 220 d Limousine in an elegant automotive showroom, soft diffused lighting, light wood floor, EuroDrive logo blurred on glass wall, rear three-quarter view, professional car photography, photorealistic, 16:9',
  },
  {
    make: 'Mercedes-Benz', model: 'C 300 e Limousine', year: 2025,
    bodyType: 'Sedan', fuelType: 'HYBRID', transmission: 'AUTOMATIC',
    power: 313, engineSize: 2.0, mileage: 0, condition: 'NEW',
    basePrice: 56200, taxRate: 0.14, customsRate: 0.04, status: 'AVAILABLE',
    photos: mkVariants([
      ['Polar White', '#F5F5F5', 'mb-c300e-wht', 'mb-c300e-wht2'],
      ['Spectral Blue Metallic', '#2D5A8E', 'mb-c300e-blu'],
      ['Obsidian Black Metallic', '#1C1C1C', 'mb-c300e-blk'],
    ]),
    features: ['Plug-in Hybrid 100km Electric Range', 'MBUX 11.9" Touchscreen', 'Digital Instrument Cluster', 'LED Headlights', 'Active Brake Assist', 'Air Body Control Suspension', 'Burmester Sound', 'Wireless Charging'],
    mjPrompt: 'Polar White 2025 Mercedes-Benz C 300 e Limousine plugin hybrid inside a futuristic showroom, cool blue accent lighting, white polished floor, EuroDrive logo blurred, front three-quarter view, professional automotive photography, photorealistic, 16:9',
  },
  {
    make: 'Mercedes-Benz', model: 'E 200 Limousine', year: 2025,
    bodyType: 'Sedan', fuelType: 'PETROL', transmission: 'AUTOMATIC',
    power: 204, engineSize: 2.0, mileage: 0, condition: 'NEW',
    basePrice: 62200, taxRate: 0.14, customsRate: 0.04, status: 'AVAILABLE',
    photos: mkVariants([
      ['Graphite Grey Metallic', '#5C5F62', 'mb-e200-gry', 'mb-e200-gry2'],
      ['Polar White', '#F5F5F5', 'mb-e200-wht'],
      ['Obsidian Black Metallic', '#1C1C1C', 'mb-e200-blk'],
      ['High-tech Silver Metallic', '#C0C0C0', 'mb-e200-sil'],
    ]),
    features: ['MBUX 14.4" Central Display', 'MBUX 12.3" Superscreen', 'Zero-Layer HMI', 'Digital Light Headlights', 'Active Steering Assist', 'Active Brake Assist', 'Burmester 3D Sound', '64-Colour Ambient Lighting'],
    mjPrompt: 'Graphite Grey Metallic 2025 Mercedes-Benz E 200 Limousine in a luxury showroom, dramatic spotlight, dark grey polished floor, EuroDrive logo blurred on dark wall, side profile, professional automotive photography, cinematic, 16:9',
    mjPromptFeatured: true,
  },
  {
    make: 'Mercedes-Benz', model: 'E 220 d Limousine', year: 2025,
    bodyType: 'Sedan', fuelType: 'DIESEL', transmission: 'AUTOMATIC',
    power: 197, engineSize: 2.0, mileage: 0, condition: 'NEW',
    basePrice: 65400, taxRate: 0.14, customsRate: 0.04, status: 'AVAILABLE',
    photos: mkVariants([
      ['Obsidian Black Metallic', '#1C1C1C', 'mb-e220d-blk', 'mb-e220d-blk2'],
      ['Polar White', '#F5F5F5', 'mb-e220d-wht'],
      ['Selenite Grey Metallic', '#9EA4A8', 'mb-e220d-gry'],
    ]),
    features: ['MBUX 14.4" Central Display', 'Digital Light Headlights', 'Active Steering Assist', 'Active Brake Assist', 'Rear Axle Steering', 'Burmester 3D Sound', '64-Colour Ambient Lighting', 'Panoramic Sunroof'],
    mjPrompt: 'Obsidian Black Metallic 2025 Mercedes-Benz E 220 d Limousine inside a sleek showroom, single key light, polished black floor, EuroDrive logo blurred on dark wall, three-quarter front view, professional automotive photography, 16:9',
  },
  {
    make: 'Mercedes-Benz', model: 'E 300 e Limousine', year: 2025,
    bodyType: 'Sedan', fuelType: 'HYBRID', transmission: 'AUTOMATIC',
    power: 313, engineSize: 2.0, mileage: 0, condition: 'NEW',
    basePrice: 72100, taxRate: 0.14, customsRate: 0.04, status: 'AVAILABLE',
    photos: mkVariants([
      ['High-tech Silver Metallic', '#C0C0C0', 'mb-e300e-sil', 'mb-e300e-sil2'],
      ['Polar White', '#F5F5F5', 'mb-e300e-wht'],
      ['Obsidian Black Metallic', '#1C1C1C', 'mb-e300e-blk'],
    ]),
    features: ['Plug-in Hybrid 100km Electric Range', 'MBUX 14.4" Central Display', 'Digital Light Headlights', 'Active Steering Assist', 'Air Body Control Suspension', 'Burmester 3D Sound', 'Rear Axle Steering', 'Panoramic Sunroof'],
    mjPrompt: 'High-tech Silver Metallic 2025 Mercedes-Benz E 300 e hybrid sedan in a modern showroom, soft overhead lighting, white marble floor, EuroDrive logo blurred, three-quarter front view, professional car photography, photorealistic, 16:9',
  },
  {
    make: 'Mercedes-Benz', model: 'S 450 d 4MATIC Limousine', year: 2025,
    bodyType: 'Sedan', fuelType: 'DIESEL', transmission: 'AUTOMATIC',
    power: 367, engineSize: 3.0, mileage: 0, condition: 'NEW',
    basePrice: 114200, taxRate: 0.14, customsRate: 0.04, status: 'AVAILABLE',
    photos: mkVariants([
      ['Obsidian Black Metallic', '#1C1C1C', 'mb-s450-blk', 'mb-s450-blk2'],
      ['Selenite Grey Metallic', '#9EA4A8', 'mb-s450-gry'],
      ['Polar White', '#F5F5F5', 'mb-s450-wht'],
    ]),
    features: ['MBUX Hyperscreen', 'Rear Executive Lounge Seats', 'Burmester® 4D Surround Sound', 'Night Vision Assistant', 'Augmented Reality HUD', 'Magic Body Control Suspension', '360° Camera System', 'Rear Axle Steering'],
    mjPrompt: 'Obsidian Black Metallic 2025 Mercedes-Benz S 450 d 4MATIC Limousine in an ultra-luxury showroom, dramatic low-key lighting, white marble floor, EuroDrive logo blurred on dark wall, side profile, professional automotive photography, cinematic, 16:9',
    mjPromptFeatured: true,
  },
  {
    make: 'Mercedes-Benz', model: 'GLC 200 4MATIC', year: 2025,
    bodyType: 'SUV', fuelType: 'PETROL', transmission: 'AUTOMATIC',
    power: 204, engineSize: 2.0, mileage: 0, condition: 'NEW',
    basePrice: 54000, taxRate: 0.14, customsRate: 0.04, status: 'AVAILABLE',
    photos: mkVariants([
      ['Polar White', '#F5F5F5', 'mb-glc200-wht', 'mb-glc200-wht2'],
      ['Obsidian Black Metallic', '#1C1C1C', 'mb-glc200-blk'],
      ['Selenite Grey Metallic', '#9EA4A8', 'mb-glc200-gry'],
      ['Spectral Blue Metallic', '#2D5A8E', 'mb-glc200-blu'],
    ]),
    features: ['MBUX 11.9" Touchscreen', 'MBUX 12.3" Passenger Display', 'Digital Instrument Cluster', 'LED Headlights', 'Active Brake Assist', 'Active Distance Assist', 'Keyless-Go', 'Panoramic Sunroof'],
    mjPrompt: 'Polar White 2025 Mercedes-Benz GLC 200 4MATIC SUV inside a modern automotive showroom, soft lighting, light grey floor, EuroDrive logo blurred on wall, front three-quarter view, professional car photography, photorealistic, 16:9',
  },
  {
    make: 'Mercedes-Benz', model: 'GLC 220 d 4MATIC', year: 2025,
    bodyType: 'SUV', fuelType: 'DIESEL', transmission: 'AUTOMATIC',
    power: 197, engineSize: 2.0, mileage: 0, condition: 'NEW',
    basePrice: 57300, taxRate: 0.14, customsRate: 0.04, status: 'AVAILABLE',
    photos: mkVariants([
      ['Selenite Grey Metallic', '#9EA4A8', 'mb-glc220d-gry', 'mb-glc220d-gry2'],
      ['Obsidian Black Metallic', '#1C1C1C', 'mb-glc220d-blk'],
      ['Polar White', '#F5F5F5', 'mb-glc220d-wht'],
    ]),
    features: ['MBUX 11.9" Touchscreen', 'MBUX Passenger Display', 'Digital Instrument Cluster', 'LED Headlights', 'Active Brake Assist', 'Burmester Sound', 'Panoramic Sunroof', 'Air Balance Package'],
    mjPrompt: 'Selenite Grey Metallic 2025 Mercedes-Benz GLC 220 d 4MATIC SUV inside an elegant showroom, soft diffused lighting, EuroDrive logo blurred in background, three-quarter front view, professional automotive photography, photorealistic, 16:9',
  },
  {
    make: 'Mercedes-Benz', model: 'GLC 300 e 4MATIC', year: 2025,
    bodyType: 'SUV', fuelType: 'HYBRID', transmission: 'AUTOMATIC',
    power: 313, engineSize: 2.0, mileage: 0, condition: 'NEW',
    basePrice: 63400, taxRate: 0.14, customsRate: 0.04, status: 'AVAILABLE',
    photos: mkVariants([
      ['Spectral Blue Metallic', '#2D5A8E', 'mb-glc300e-blu', 'mb-glc300e-blu2'],
      ['Polar White', '#F5F5F5', 'mb-glc300e-wht'],
      ['Obsidian Black Metallic', '#1C1C1C', 'mb-glc300e-blk'],
    ]),
    features: ['Plug-in Hybrid 120km Electric Range', 'MBUX 11.9" Touchscreen', 'MBUX Passenger Display', 'LED Headlights', 'Active Brake Assist', 'Air Body Control Suspension', 'Panoramic Sunroof', 'Wireless Charging'],
    mjPrompt: 'Spectral Blue Metallic 2025 Mercedes-Benz GLC 300 e 4MATIC plugin hybrid SUV in a modern showroom, blue accent lighting, dark floor, EuroDrive logo blurred, front three-quarter view, professional car photography, photorealistic, 16:9',
  },
  {
    make: 'Mercedes-Benz', model: 'GLE 300 d 4MATIC', year: 2025,
    bodyType: 'SUV', fuelType: 'DIESEL', transmission: 'AUTOMATIC',
    power: 265, engineSize: 2.0, mileage: 0, condition: 'NEW',
    basePrice: 74100, taxRate: 0.14, customsRate: 0.04, status: 'AVAILABLE',
    photos: mkVariants([
      ['Obsidian Black Metallic', '#1C1C1C', 'mb-gle300d-blk', 'mb-gle300d-blk2'],
      ['Selenite Grey Metallic', '#9EA4A8', 'mb-gle300d-gry'],
      ['Polar White', '#F5F5F5', 'mb-gle300d-wht'],
    ]),
    features: ['MBUX 12.3" Touchscreen', 'MBUX Head-Up Display', 'LED Headlights', 'Active Brake Assist', 'Active Distance Assist DISTRONIC', 'Keyless-Go', 'Panoramic Sunroof', '360° Camera'],
    mjPrompt: 'Obsidian Black Metallic 2025 Mercedes-Benz GLE 300 d 4MATIC SUV inside a luxury showroom, dramatic spotlight lighting, dark epoxy floor, EuroDrive logo blurred, side profile, professional automotive photography, 16:9',
  },
  {
    make: 'Mercedes-Benz', model: 'GLE 450 d 4MATIC', year: 2025,
    bodyType: 'SUV', fuelType: 'DIESEL', transmission: 'AUTOMATIC',
    power: 367, engineSize: 3.0, mileage: 0, condition: 'NEW',
    basePrice: 90200, taxRate: 0.14, customsRate: 0.04, status: 'AVAILABLE',
    photos: mkVariants([
      ['Polar White', '#F5F5F5', 'mb-gle450d-wht', 'mb-gle450d-wht2'],
      ['Selenite Grey Metallic', '#9EA4A8', 'mb-gle450d-gry'],
      ['Obsidian Black Metallic', '#1C1C1C', 'mb-gle450d-blk'],
    ]),
    features: ['MBUX 12.3" Touchscreen', 'MBUX Head-Up Display', 'LED Headlights', 'Active Brake Assist', 'Air Body Control Suspension', 'Burmester Sound', 'Panoramic Sunroof', '360° Camera'],
    mjPrompt: 'Polar White 2025 Mercedes-Benz GLE 450 d 4MATIC SUV inside a premium car showroom, soft overhead lighting, light grey floor, EuroDrive logo blurred on background wall, three-quarter front view, professional automotive photography, photorealistic, 16:9',
    mjPromptFeatured: true,
  },
  {
    make: 'Mercedes-Benz', model: 'GLS 450 d 4MATIC', year: 2025,
    bodyType: 'SUV', fuelType: 'DIESEL', transmission: 'AUTOMATIC',
    power: 367, engineSize: 3.0, mileage: 0, condition: 'NEW',
    basePrice: 107400, taxRate: 0.14, customsRate: 0.04, status: 'AVAILABLE',
    photos: mkVariants([
      ['Obsidian Black Metallic', '#1C1C1C', 'mb-gls450-blk', 'mb-gls450-blk2'],
      ['Selenite Grey Metallic', '#9EA4A8', 'mb-gls450-gry'],
      ['Polar White', '#F5F5F5', 'mb-gls450-wht'],
    ]),
    features: ['MBUX 12.3" Touchscreen', '7-Seat Configuration', 'MBUX Head-Up Display', 'LED Headlights', 'Air Body Control Suspension', 'Burmester Surround Sound', 'Panoramic Sunroof', '360° Camera'],
    mjPrompt: 'Obsidian Black Metallic 2025 Mercedes-Benz GLS 450 d 4MATIC 7-seat SUV in an ultra-luxury showroom, dramatic low-key lighting, white marble floor, EuroDrive logo blurred, three-quarter front view, cinematic car photography, 16:9',
    mjPromptFeatured: true,
  },
  {
    make: 'Mercedes-Benz', model: 'EQA 250', year: 2025,
    bodyType: 'SUV', fuelType: 'ELECTRIC', transmission: 'AUTOMATIC',
    power: 190, engineSize: null, mileage: 0, condition: 'NEW',
    basePrice: 55000, taxRate: 0.14, customsRate: 0.04, status: 'AVAILABLE',
    photos: mkVariants([
      ['Polar White', '#F5F5F5', 'mb-eqa-wht', 'mb-eqa-wht2'],
      ['Night Black', '#1A1A1A', 'mb-eqa-blk'],
      ['Spectral Blue Metallic', '#2D5A8E', 'mb-eqa-blu'],
    ]),
    features: ['306km Range (WLTP)', 'MBUX 10.25" Touchscreen', 'Digital Instrument Cluster', 'LED Headlights', 'Active Brake Assist', 'DC Fast Charging 100kW', 'Wireless Charging', 'Keyless-Go'],
    mjPrompt: 'Polar White 2025 Mercedes-Benz EQA 250 electric SUV inside a futuristic showroom, cool white LED lighting, white polished floor, EuroDrive logo blurred, front three-quarter view, professional automotive photography, 16:9',
  },
  {
    make: 'Mercedes-Benz', model: 'EQE 350', year: 2025,
    bodyType: 'Sedan', fuelType: 'ELECTRIC', transmission: 'AUTOMATIC',
    power: 292, engineSize: null, mileage: 0, condition: 'NEW',
    basePrice: 74200, taxRate: 0.14, customsRate: 0.04, status: 'AVAILABLE',
    photos: mkVariants([
      ['Graphite Grey Metallic', '#5C5F62', 'mb-eqe-gry', 'mb-eqe-gry2'],
      ['Polar White', '#F5F5F5', 'mb-eqe-wht'],
      ['Obsidian Black Metallic', '#1C1C1C', 'mb-eqe-blk'],
    ]),
    features: ['660km Range (WLTP)', 'MBUX Hyperscreen (optional)', 'Digital Light Headlights', 'Air Body Control Suspension', 'DC Fast Charging 170kW', 'Burmester Sound', 'Panoramic Sunroof', 'Augmented Reality HUD'],
    mjPrompt: 'Graphite Grey Metallic 2025 Mercedes-Benz EQE 350 electric sedan in a sleek modern showroom, dramatic lighting, dark reflective floor, EuroDrive logo blurred, side profile, professional car photography, cinematic, 16:9',
  },
  {
    make: 'Mercedes-Benz', model: 'EQS 450+', year: 2025,
    bodyType: 'Sedan', fuelType: 'ELECTRIC', transmission: 'AUTOMATIC',
    power: 360, engineSize: null, mileage: 0, condition: 'NEW',
    basePrice: 113000, taxRate: 0.14, customsRate: 0.04, status: 'AVAILABLE',
    photos: mkVariants([
      ['Obsidian Black Metallic', '#1C1C1C', 'mb-eqs-blk', 'mb-eqs-blk2'],
      ['High-tech Silver Metallic', '#C0C0C0', 'mb-eqs-sil'],
    ]),
    features: ['770km Range (WLTP)', 'MBUX Hyperscreen 1.41m Display', 'Digital Light Headlights', 'Rear Axle Steering', 'Magic Body Control Suspension', 'Burmester® 4D Sound', 'DC Fast Charging 200kW', 'Night Vision Assistant'],
    mjPrompt: 'Obsidian Black Metallic 2025 Mercedes-Benz EQS 450+ electric flagship sedan in an ultra-luxury showroom, dramatic low-key studio lighting, white marble floor, EuroDrive logo blurred on dark wall, three-quarter front view, cinematic automotive photography, 16:9',
    mjPromptFeatured: true,
  },

  // ─────────────────────────────────── BMW ─────────────────────────────────────

  {
    make: 'BMW', model: '118i', year: 2025,
    bodyType: 'Sedan', fuelType: 'PETROL', transmission: 'AUTOMATIC',
    power: 170, engineSize: 1.5, mileage: 0, condition: 'NEW',
    basePrice: 38100, taxRate: 0.14, customsRate: 0.04, status: 'AVAILABLE',
    photos: mkVariants([
      ['Black Sapphire Metallic', '#1A1F2E', 'bmw-118i-blk', 'bmw-118i-blk2'],
      ['Alpine White', '#F5F5F5', 'bmw-118i-wht'],
      ['Mineral Grey Metallic', '#888D92', 'bmw-118i-gry'],
      ['San Remo Green Metallic', '#4A7358', 'bmw-118i-grn'],
    ]),
    features: ['BMW Live Cockpit Professional', 'iDrive 8 with 10.25" Touchscreen', 'LED Headlights', 'Parking Assistant', 'Active Cruise Control', 'Lane Departure Warning', 'BMW ConnectedDrive', 'Wireless Charging'],
    mjPrompt: 'Black Sapphire Metallic 2025 BMW 118i inside a modern BMW showroom, clean white background, polished floor, EuroDrive logo blurred on wall, three-quarter front view, professional automotive photography, photorealistic, 16:9',
  },
  {
    make: 'BMW', model: '320i Limousine', year: 2025,
    bodyType: 'Sedan', fuelType: 'PETROL', transmission: 'AUTOMATIC',
    power: 184, engineSize: 2.0, mileage: 0, condition: 'NEW',
    basePrice: 47100, taxRate: 0.14, customsRate: 0.04, status: 'AVAILABLE',
    photos: mkVariants([
      ['Alpine White', '#F5F5F5', 'bmw-320i-wht', 'bmw-320i-wht2'],
      ['Black Sapphire Metallic', '#1A1F2E', 'bmw-320i-blk'],
      ['Portimão Blue Metallic', '#1E3D6B', 'bmw-320i-blu'],
      ['Brooklyn Grey Metallic', '#6B6D72', 'bmw-320i-gry'],
    ]),
    features: ['BMW Live Cockpit Professional', 'iDrive 8 with 10.25" Touchscreen', 'LED Headlights', 'Parking Assistant Plus', 'Active Cruise Control', 'Driving Assistant Professional', 'Harman Kardon Sound', 'Panoramic Sunroof'],
    mjPrompt: 'Alpine White 2025 BMW 320i Limousine in a sleek BMW showroom, studio lighting, white reflective floor, EuroDrive logo blurred, three-quarter front view, professional automotive photography, photorealistic, 16:9',
  },
  {
    make: 'BMW', model: '330d Limousine', year: 2025,
    bodyType: 'Sedan', fuelType: 'DIESEL', transmission: 'AUTOMATIC',
    power: 286, engineSize: 3.0, mileage: 0, condition: 'NEW',
    basePrice: 57200, taxRate: 0.14, customsRate: 0.04, status: 'AVAILABLE',
    photos: mkVariants([
      ['Black Sapphire Metallic', '#1A1F2E', 'bmw-330d-blk', 'bmw-330d-blk2'],
      ['Alpine White', '#F5F5F5', 'bmw-330d-wht'],
      ['Brooklyn Grey Metallic', '#6B6D72', 'bmw-330d-gry'],
    ]),
    features: ['BMW Live Cockpit Professional', 'iDrive 8', 'LED Laser Headlights', 'Parking Assistant Plus', 'Driving Assistant Professional', 'Harman Kardon Sound', 'Panoramic Sunroof', 'Head-Up Display'],
    mjPrompt: 'Black Sapphire Metallic 2025 BMW 330d Limousine inside a premium showroom, dramatic lighting, dark floor, EuroDrive logo blurred, side profile, professional automotive photography, 16:9',
  },
  {
    make: 'BMW', model: 'M3 Competition xDrive', year: 2025,
    bodyType: 'Sedan', fuelType: 'PETROL', transmission: 'AUTOMATIC',
    power: 510, engineSize: 3.0, mileage: 0, condition: 'NEW',
    basePrice: 100100, taxRate: 0.14, customsRate: 0.04, status: 'AVAILABLE',
    photos: mkVariants([
      ['Isle of Man Green Metallic', '#3D6B4F', 'bmw-m3-grn', 'bmw-m3-grn2'],
      ['Sao Paulo Yellow', '#D4A800', 'bmw-m3-yel'],
      ['Black Sapphire Metallic', '#1A1F2E', 'bmw-m3-blk'],
    ]),
    features: ['M TwinPower Turbo Inline-6', 'M xDrive All-Wheel Drive', 'M Sport Differential', 'M Carbon Ceramic Brakes', 'M Adaptive Suspension', 'BMW M Bucket Seats', 'Head-Up Display', 'Harman Kardon Sound'],
    mjPrompt: 'Isle of Man Green Metallic 2025 BMW M3 Competition xDrive in a high-performance showroom, dramatic spotlight, dark floor, EuroDrive logo blurred on wall, three-quarter front view showing M bumper, professional automotive photography, cinematic, 16:9',
    mjPromptFeatured: true,
  },
  {
    make: 'BMW', model: '520i Limousine', year: 2025,
    bodyType: 'Sedan', fuelType: 'PETROL', transmission: 'AUTOMATIC',
    power: 208, engineSize: 2.0, mileage: 0, condition: 'NEW',
    basePrice: 59100, taxRate: 0.14, customsRate: 0.04, status: 'AVAILABLE',
    photos: mkVariants([
      ['Mineral Grey Metallic', '#888D92', 'bmw-520i-gry', 'bmw-520i-gry2'],
      ['Alpine White', '#F5F5F5', 'bmw-520i-wht'],
      ['Black Sapphire Metallic', '#1A1F2E', 'bmw-520i-blk'],
      ['Marina Bay Blue Metallic', '#2B6AA3', 'bmw-520i-blu'],
    ]),
    features: ['BMW Curved Display 12.3"+14.9"', 'iDrive 8.5 with BMW OS9', 'LED Laser Headlights', 'Parking Assistant Professional', 'Driving Assistant Professional', 'Harman Kardon Sound', 'Head-Up Display', 'Panoramic Glass Roof'],
    mjPrompt: 'Mineral Grey Metallic 2025 BMW 520i Limousine inside a modern showroom, soft studio lighting, light floor, EuroDrive logo blurred, three-quarter front view, professional car photography, photorealistic, 16:9',
  },
  {
    make: 'BMW', model: '530d Limousine', year: 2025,
    bodyType: 'Sedan', fuelType: 'DIESEL', transmission: 'AUTOMATIC',
    power: 286, engineSize: 3.0, mileage: 0, condition: 'NEW',
    basePrice: 68200, taxRate: 0.14, customsRate: 0.04, status: 'AVAILABLE',
    photos: mkVariants([
      ['Black Sapphire Metallic', '#1A1F2E', 'bmw-530d-blk', 'bmw-530d-blk2'],
      ['Dravit Grey Metallic', '#606570', 'bmw-530d-dgry'],
      ['Alpine White', '#F5F5F5', 'bmw-530d-wht'],
    ]),
    features: ['BMW Curved Display', 'iDrive 8.5', 'LED Laser Headlights', 'Driving Assistant Professional', 'Parking Assistant Professional', 'Bowers & Wilkins Diamond Sound', 'Head-Up Display', 'Panoramic Glass Roof'],
    mjPrompt: 'Black Sapphire Metallic 2025 BMW 530d Limousine in a sleek showroom, dramatic side lighting, dark floor, EuroDrive logo blurred, side profile, professional automotive photography, 16:9',
  },
  {
    make: 'BMW', model: '740i', year: 2025,
    bodyType: 'Sedan', fuelType: 'PETROL', transmission: 'AUTOMATIC',
    power: 381, engineSize: 3.0, mileage: 0, condition: 'NEW',
    basePrice: 102200, taxRate: 0.14, customsRate: 0.04, status: 'AVAILABLE',
    photos: mkVariants([
      ['Carbon Black Metallic', '#2C2C2C', 'bmw-740i-blk', 'bmw-740i-blk2'],
      ['Frozen Caesium Blue Metallic', '#2E4A6A', 'bmw-740i-blu'],
      ['Dravit Grey Metallic', '#606570', 'bmw-740i-gry'],
    ]),
    features: ['BMW Curved Display', 'Executive Lounge Rear Seats', 'Bowers & Wilkins Diamond Sound', 'Sky Lounge Panoramic Roof', 'BMW Personal CoPilot', 'Parking Assistant Professional', 'Head-Up Display', 'Massage Seats'],
    mjPrompt: 'Carbon Black Metallic 2025 BMW 740i luxury sedan in an ultra-premium showroom, dramatic low-key lighting, black marble floor, EuroDrive logo blurred on dark wall, three-quarter front view, cinematic car photography, 16:9',
    mjPromptFeatured: true,
  },
  {
    make: 'BMW', model: 'i4 eDrive35 Gran Coupé', year: 2025,
    bodyType: 'Sedan', fuelType: 'ELECTRIC', transmission: 'AUTOMATIC',
    power: 286, engineSize: null, mileage: 0, condition: 'NEW',
    basePrice: 44900, taxRate: 0.14, customsRate: 0.04, status: 'AVAILABLE',
    photos: mkVariants([
      ['Black Sapphire Metallic', '#1A1F2E', 'bmw-i4-blk', 'bmw-i4-blk2'],
      ['Alpine White', '#F5F5F5', 'bmw-i4-wht'],
      ['Portimão Blue Metallic', '#1E3D6B', 'bmw-i4-blu'],
    ]),
    features: ['590km Range (WLTP)', 'BMW Curved Display', 'iDrive 8', 'DC Fast Charging 205kW', 'Parking Assistant Plus', 'Driving Assistant Professional', 'Harman Kardon Sound', 'Head-Up Display'],
    mjPrompt: 'Black Sapphire Metallic 2025 BMW i4 eDrive35 Gran Coupé electric sedan inside a futuristic showroom, cool blue accent lighting, dark floor, EuroDrive logo blurred, front three-quarter view, professional automotive photography, 16:9',
  },
  {
    make: 'BMW', model: 'i5 eDrive40', year: 2025,
    bodyType: 'Sedan', fuelType: 'ELECTRIC', transmission: 'AUTOMATIC',
    power: 340, engineSize: null, mileage: 0, condition: 'NEW',
    basePrice: 59200, taxRate: 0.14, customsRate: 0.04, status: 'AVAILABLE',
    photos: mkVariants([
      ['Mineral Grey Metallic', '#888D92', 'bmw-i5-gry', 'bmw-i5-gry2'],
      ['Alpine White', '#F5F5F5', 'bmw-i5-wht'],
      ['Black Sapphire Metallic', '#1A1F2E', 'bmw-i5-blk'],
    ]),
    features: ['582km Range (WLTP)', 'BMW Curved Display', 'iDrive 8.5 with BMW OS9', 'DC Fast Charging 205kW', 'Driving Assistant Professional', 'Bowers & Wilkins Sound', 'Head-Up Display', 'Panoramic Glass Roof'],
    mjPrompt: 'Mineral Grey Metallic 2025 BMW i5 eDrive40 electric sedan inside a modern showroom, studio lighting, light floor, EuroDrive logo blurred, three-quarter front view, professional automotive photography, photorealistic, 16:9',
  },
  {
    make: 'BMW', model: 'i7 xDrive60', year: 2025,
    bodyType: 'Sedan', fuelType: 'ELECTRIC', transmission: 'AUTOMATIC',
    power: 544, engineSize: null, mileage: 0, condition: 'NEW',
    basePrice: 128900, taxRate: 0.14, customsRate: 0.04, status: 'AVAILABLE',
    photos: mkVariants([
      ['Frozen Black Metallic', '#2C2C2C', 'bmw-i7-blk', 'bmw-i7-blk2'],
      ['Mineral White Metallic', '#E8E8E8', 'bmw-i7-wht'],
    ]),
    features: ['625km Range (WLTP)', 'BMW Theatre Screen 31.3" 8K', 'Sky Lounge Panoramic Roof', 'Executive Lounge Rear Seats', 'Bowers & Wilkins Diamond Sound', 'DC Fast Charging 195kW', 'Parking Assistant Professional', 'Massage Seats All-Round'],
    mjPrompt: 'Frozen Black Metallic 2025 BMW i7 xDrive60 electric flagship sedan in an ultra-luxury showroom, dramatic low-key lighting, black marble floor, EuroDrive logo blurred on dark wall, three-quarter front view, cinematic automotive photography, 16:9',
    mjPromptFeatured: true,
  },
  {
    make: 'BMW', model: 'iX1 eDrive20', year: 2025,
    bodyType: 'SUV', fuelType: 'ELECTRIC', transmission: 'AUTOMATIC',
    power: 204, engineSize: null, mileage: 0, condition: 'NEW',
    basePrice: 44700, taxRate: 0.14, customsRate: 0.04, status: 'AVAILABLE',
    photos: mkVariants([
      ['Alpine White', '#F5F5F5', 'bmw-ix1-wht', 'bmw-ix1-wht2'],
      ['Black Sapphire Metallic', '#1A1F2E', 'bmw-ix1-blk'],
      ['Mineral Grey Metallic', '#888D92', 'bmw-ix1-gry'],
    ]),
    features: ['440km Range (WLTP)', 'BMW Curved Display', 'iDrive 8', 'DC Fast Charging 130kW', 'Parking Assistant Plus', 'Driving Assistant', 'Harman Kardon Sound', 'Panoramic Sunroof'],
    mjPrompt: 'Alpine White 2025 BMW iX1 eDrive20 electric compact SUV inside a modern showroom, clean studio lighting, white floor, EuroDrive logo blurred, front three-quarter view, professional automotive photography, 16:9',
  },
  {
    make: 'BMW', model: 'X1 xDrive23d', year: 2025,
    bodyType: 'SUV', fuelType: 'DIESEL', transmission: 'AUTOMATIC',
    power: 211, engineSize: 2.0, mileage: 0, condition: 'NEW',
    basePrice: 50400, taxRate: 0.14, customsRate: 0.04, status: 'AVAILABLE',
    photos: mkVariants([
      ['Island Bay Blue Metallic', '#2B4E7A', 'bmw-x1-blu', 'bmw-x1-blu2'],
      ['Black Sapphire Metallic', '#1A1F2E', 'bmw-x1-blk'],
      ['Alpine White', '#F5F5F5', 'bmw-x1-wht'],
      ['Mineral Grey Metallic', '#888D92', 'bmw-x1-gry'],
    ]),
    features: ['BMW Curved Display', 'iDrive 8', 'LED Headlights', 'Parking Assistant Plus', 'Active Cruise Control', 'Lane Keeping Assistant', 'Panoramic Sunroof', 'Harman Kardon Sound'],
    mjPrompt: 'Island Bay Blue Metallic 2025 BMW X1 xDrive23d SUV inside a modern showroom, studio lighting, polished floor, EuroDrive logo blurred, three-quarter front view, professional automotive photography, photorealistic, 16:9',
  },
  {
    make: 'BMW', model: 'X3 xDrive20d', year: 2025,
    bodyType: 'SUV', fuelType: 'DIESEL', transmission: 'AUTOMATIC',
    power: 197, engineSize: 2.0, mileage: 0, condition: 'NEW',
    basePrice: 60300, taxRate: 0.14, customsRate: 0.04, status: 'AVAILABLE',
    photos: mkVariants([
      ['Phytonic Blue Metallic', '#1E5C8A', 'bmw-x3-blu', 'bmw-x3-blu2'],
      ['Black Sapphire Metallic', '#1A1F2E', 'bmw-x3-blk'],
      ['Alpine White', '#F5F5F5', 'bmw-x3-wht'],
      ['Skyscraper Grey Metallic', '#7A7D80', 'bmw-x3-gry'],
    ]),
    features: ['BMW Curved Display 12.3"+14.9"', 'iDrive 8.5 with BMW OS9', 'LED Laser Headlights', 'Parking Assistant Professional', 'Driving Assistant Professional', 'Panoramic Glass Roof', 'Harman Kardon Sound', 'Head-Up Display'],
    mjPrompt: 'Phytonic Blue Metallic 2025 BMW X3 xDrive20d SUV inside a premium showroom, dramatic lighting, dark floor, EuroDrive logo blurred, front three-quarter view, professional automotive photography, cinematic, 16:9',
  },
  {
    make: 'BMW', model: 'X5 xDrive30d', year: 2025,
    bodyType: 'SUV', fuelType: 'DIESEL', transmission: 'AUTOMATIC',
    power: 298, engineSize: 3.0, mileage: 0, condition: 'NEW',
    basePrice: 80200, taxRate: 0.14, customsRate: 0.04, status: 'AVAILABLE',
    photos: mkVariants([
      ['Black Sapphire Metallic', '#1A1F2E', 'bmw-x5-blk', 'bmw-x5-blk2'],
      ['Tanzanite Blue Metallic', '#1A3A6B', 'bmw-x5-blu'],
      ['Arctic Race Blue Metallic', '#1E4A7A', 'bmw-x5-ablu'],
      ['Mineral Grey Metallic', '#888D92', 'bmw-x5-gry'],
    ]),
    features: ['BMW Curved Display 12.3"+14.9"', 'iDrive 8.5', 'LED Laser Headlights', 'Parking Assistant Professional', 'Driving Assistant Professional', 'Bowers & Wilkins Diamond Sound', 'Panoramic Sky Lounge Roof', 'Head-Up Display'],
    mjPrompt: 'Black Sapphire Metallic 2025 BMW X5 xDrive30d SUV inside a luxury showroom, dramatic low-key lighting, dark marble floor, EuroDrive logo blurred on wall, three-quarter front view, cinematic automotive photography, 16:9',
    mjPromptFeatured: true,
  },
  {
    make: 'BMW', model: 'X5 M60i', year: 2025,
    bodyType: 'SUV', fuelType: 'PETROL', transmission: 'AUTOMATIC',
    power: 530, engineSize: 4.4, mileage: 0, condition: 'NEW',
    basePrice: 125600, taxRate: 0.14, customsRate: 0.04, status: 'AVAILABLE',
    photos: mkVariants([
      ['Dark Graphite Metallic', '#3A3C3E', 'bmw-x5m60-dgry', 'bmw-x5m60-dgry2'],
      ['Frozen Pure Grey Metallic', '#9A9DA0', 'bmw-x5m60-pgry'],
      ['Black Sapphire Metallic', '#1A1F2E', 'bmw-x5m60-blk'],
    ]),
    features: ['4.4L V8 TwinPower Turbo', 'M xDrive All-Wheel Drive', 'M Compound Brakes', 'M Adaptive Suspension', 'M Sport Exhaust', 'BMW Curved Display', 'Bowers & Wilkins Diamond Sound', 'Panoramic Sky Lounge Roof'],
    mjPrompt: 'Dark Graphite Metallic 2025 BMW X5 M60i high-performance SUV inside a dynamic showroom, dramatic spotlight, dark reflective floor, EuroDrive logo blurred, front three-quarter view, professional automotive photography, cinematic, 16:9',
    mjPromptFeatured: true,
  },
  {
    make: 'BMW', model: 'X7 xDrive40i', year: 2025,
    bodyType: 'SUV', fuelType: 'PETROL', transmission: 'AUTOMATIC',
    power: 381, engineSize: 3.0, mileage: 0, condition: 'NEW',
    basePrice: 105400, taxRate: 0.14, customsRate: 0.04, status: 'AVAILABLE',
    photos: mkVariants([
      ['Alpine White', '#F5F5F5', 'bmw-x7-wht', 'bmw-x7-wht2'],
      ['Arctic Race Blue Metallic', '#1E4A7A', 'bmw-x7-blu'],
      ['Frozen Grey Metallic', '#9A9DA0', 'bmw-x7-gry'],
    ]),
    features: ['7-Seat Luxury Configuration', 'BMW Curved Display', 'Sky Lounge Panoramic Roof', 'Bowers & Wilkins Diamond Sound', 'Executive Lounge Rear Seats', 'Parking Assistant Professional', 'Head-Up Display', 'Massage Seats'],
    mjPrompt: 'Alpine White 2025 BMW X7 xDrive40i luxury 7-seat SUV inside a spacious showroom, overhead soft lighting, polished white floor, EuroDrive logo blurred, front three-quarter view, professional automotive photography, 16:9',
    mjPromptFeatured: true,
  },

  // ─────────────────────────────── LAND ROVER ──────────────────────────────────

  {
    make: 'Land Rover', model: 'Discovery Sport D165', year: 2025,
    bodyType: 'SUV', fuelType: 'DIESEL', transmission: 'AUTOMATIC',
    power: 165, engineSize: 2.0, mileage: 0, condition: 'NEW',
    basePrice: 45300, taxRate: 0.14, customsRate: 0.04, status: 'AVAILABLE',
    photos: mkVariants([
      ['Fuji White', '#F5F5F0', 'lr-ds-d165-wht', 'lr-ds-d165-wht2'],
      ['Santorini Black', '#1A1A1A', 'lr-ds-d165-blk'],
      ['Hakuba Silver', '#C8CDD0', 'lr-ds-d165-sil'],
      ['Carpathian Grey', '#5A6066', 'lr-ds-d165-gry'],
    ]),
    features: ['Terrain Response', '7-Seat Option', 'Pivi Pro 11.4" Touchscreen', 'LED Headlights', 'Rear Camera', 'Parking Aid', 'Lane Keeping Assist', 'Driver Condition Monitor'],
    mjPrompt: 'Fuji White 2025 Land Rover Discovery Sport D165 inside a modern showroom, soft overhead lighting, light epoxy floor, EuroDrive logo blurred on wall, three-quarter front view, professional automotive photography, photorealistic, 16:9',
  },
  {
    make: 'Land Rover', model: 'Discovery Sport P200 MHEV', year: 2025,
    bodyType: 'SUV', fuelType: 'HYBRID', transmission: 'AUTOMATIC',
    power: 200, engineSize: 2.0, mileage: 0, condition: 'NEW',
    basePrice: 47800, taxRate: 0.14, customsRate: 0.04, status: 'AVAILABLE',
    photos: mkVariants([
      ['Carpathian Grey', '#5A6066', 'lr-ds-p200-gry', 'lr-ds-p200-gry2'],
      ['Fuji White', '#F5F5F0', 'lr-ds-p200-wht'],
      ['Santorini Black', '#1A1A1A', 'lr-ds-p200-blk'],
    ]),
    features: ['Mild Hybrid Technology', 'Terrain Response', '7-Seat Option', 'Pivi Pro 11.4" Touchscreen', 'LED Headlights', 'Panoramic Sunroof', 'Meridian Sound System', 'All-Wheel Drive'],
    mjPrompt: 'Carpathian Grey 2025 Land Rover Discovery Sport P200 MHEV hybrid SUV inside a showroom, soft lighting, polished floor, EuroDrive logo blurred, front three-quarter view, professional automotive photography, 16:9',
  },
  {
    make: 'Land Rover', model: 'Discovery D300', year: 2025,
    bodyType: 'SUV', fuelType: 'DIESEL', transmission: 'AUTOMATIC',
    power: 300, engineSize: 3.0, mileage: 0, condition: 'NEW',
    basePrice: 72100, taxRate: 0.14, customsRate: 0.04, status: 'AVAILABLE',
    photos: mkVariants([
      ['Santorini Black', '#1A1A1A', 'lr-disc-d300-blk', 'lr-disc-d300-blk2'],
      ['Fuji White', '#F5F5F0', 'lr-disc-d300-wht'],
      ['Gondwana Stone', '#A09688', 'lr-disc-d300-stn'],
    ]),
    features: ['7-Seat Full Configuration', 'Terrain Response 2', 'Pivi Pro 11.4" Touchscreen', 'Meridian 3D Surround Sound', 'LED Headlights', 'Panoramic Sunroof', 'Air Suspension', 'Wade Sensing'],
    mjPrompt: 'Santorini Black 2025 Land Rover Discovery D300 7-seat SUV in a premium showroom, dramatic lighting, dark floor, EuroDrive logo blurred, front three-quarter view, professional automotive photography, cinematic, 16:9',
  },
  {
    make: 'Land Rover', model: 'Defender 90 P300', year: 2025,
    bodyType: 'SUV', fuelType: 'PETROL', transmission: 'AUTOMATIC',
    power: 300, engineSize: 2.0, mileage: 0, condition: 'NEW',
    basePrice: 57200, taxRate: 0.14, customsRate: 0.04, status: 'AVAILABLE',
    photos: mkVariants([
      ['Tasman Blue', '#2B5070', 'lr-def90-blu', 'lr-def90-blu2'],
      ['Fuji White', '#F5F5F0', 'lr-def90-wht'],
      ['Santorini Black', '#1A1A1A', 'lr-def90-blk'],
      ['Sedona Red', '#8B2E1A', 'lr-def90-red'],
    ]),
    features: ['Terrain Response 2', 'All-Wheel Drive', 'Pivi Pro 11.4" Touchscreen', 'LED Headlights', 'Wade Sensing 900mm', 'Hill Descent Control', 'ClearSight Rear-View Mirror', 'Configurable Terrain Response'],
    mjPrompt: 'Tasman Blue 2025 Land Rover Defender 90 P300 inside an adventure-focused showroom, dramatic lighting, industrial floor, EuroDrive logo blurred on wall, front three-quarter view, professional automotive photography, 16:9',
  },
  {
    make: 'Land Rover', model: 'Defender 110 D250', year: 2025,
    bodyType: 'SUV', fuelType: 'DIESEL', transmission: 'AUTOMATIC',
    power: 250, engineSize: 3.0, mileage: 0, condition: 'NEW',
    basePrice: 69900, taxRate: 0.14, customsRate: 0.04, status: 'AVAILABLE',
    photos: mkVariants([
      ['Hakuba Silver', '#C8CDD0', 'lr-def110d-sil', 'lr-def110d-sil2'],
      ['Santorini Black', '#1A1A1A', 'lr-def110d-blk'],
      ['Fuji White', '#F5F5F0', 'lr-def110d-wht'],
      ['Firenze Red', '#8B2A1A', 'lr-def110d-red'],
    ]),
    features: ['5-Door 5-Seat Configuration', 'Terrain Response 2', 'Pivi Pro 11.4" Touchscreen', 'Meridian Sound System', 'LED Headlights', 'Wade Sensing 900mm', 'Air Suspension (option)', 'Panoramic Sunroof'],
    mjPrompt: 'Hakuba Silver 2025 Land Rover Defender 110 D250 diesel inside a showroom, overhead lighting, polished concrete floor, EuroDrive logo blurred, side profile, professional automotive photography, 16:9',
  },
  {
    make: 'Land Rover', model: 'Defender 110 P400e', year: 2025,
    bodyType: 'SUV', fuelType: 'HYBRID', transmission: 'AUTOMATIC',
    power: 404, engineSize: 2.0, mileage: 0, condition: 'NEW',
    basePrice: 83900, taxRate: 0.14, customsRate: 0.04, status: 'AVAILABLE',
    photos: mkVariants([
      ['Fuji White', '#F5F5F0', 'lr-def110e-wht', 'lr-def110e-wht2'],
      ['Tasman Blue', '#2B5070', 'lr-def110e-blu'],
      ['Santorini Black', '#1A1A1A', 'lr-def110e-blk'],
    ]),
    features: ['Plug-in Hybrid 43km Electric Range', 'Terrain Response 2', 'Pivi Pro 11.4" Touchscreen', 'Meridian 3D Sound', 'LED Headlights', 'Wade Sensing', 'Air Suspension', 'Wireless Charging'],
    mjPrompt: 'Fuji White 2025 Land Rover Defender 110 P400e plugin hybrid inside a modern showroom, bright studio lighting, white floor, EuroDrive logo blurred, three-quarter front view, professional car photography, 16:9',
    mjPromptFeatured: true,
  },
  {
    make: 'Land Rover', model: 'Range Rover Evoque P200 MHEV', year: 2025,
    bodyType: 'SUV', fuelType: 'HYBRID', transmission: 'AUTOMATIC',
    power: 200, engineSize: 2.0, mileage: 0, condition: 'NEW',
    basePrice: 48200, taxRate: 0.14, customsRate: 0.04, status: 'AVAILABLE',
    photos: mkVariants([
      ['Fuji White', '#F5F5F0', 'lr-evoque-wht', 'lr-evoque-wht2'],
      ['Santorini Black', '#1A1A1A', 'lr-evoque-blk'],
      ['Seoul Pearl Silver', '#C0C5CA', 'lr-evoque-sil'],
      ['Magellan Black Metallic', '#2A2A2A', 'lr-evoque-mblk'],
    ]),
    features: ['Mild Hybrid Technology', 'Pivi Pro 11.4" Touchscreen', 'ClearSight Ground View', 'LED Headlights', 'Parking Aid with Camera', 'Lane Keeping Assist', 'Driver Condition Monitor', 'Wireless Charging'],
    mjPrompt: 'Fuji White 2025 Range Rover Evoque P200 MHEV inside a stylish modern showroom, soft diffused lighting, light grey floor, EuroDrive logo blurred on wall, three-quarter front view, professional automotive photography, photorealistic, 16:9',
  },
  {
    make: 'Land Rover', model: 'Range Rover Evoque P300e', year: 2025,
    bodyType: 'SUV', fuelType: 'HYBRID', transmission: 'AUTOMATIC',
    power: 309, engineSize: 1.5, mileage: 0, condition: 'NEW',
    basePrice: 62000, taxRate: 0.14, customsRate: 0.04, status: 'AVAILABLE',
    photos: mkVariants([
      ['Carpathian Grey', '#5A6066', 'lr-evoque-p300e-gry', 'lr-evoque-p300e-gry2'],
      ['Fuji White', '#F5F5F0', 'lr-evoque-p300e-wht'],
      ['Santorini Black', '#1A1A1A', 'lr-evoque-p300e-blk'],
    ]),
    features: ['Plug-in Hybrid 63km Electric Range', 'Pivi Pro 11.4" Touchscreen', 'ClearSight Ground View', 'LED Headlights', 'Panoramic Sunroof', 'Meridian Sound', 'Wireless Charging', 'All-Wheel Drive'],
    mjPrompt: 'Carpathian Grey 2025 Range Rover Evoque P300e plug-in hybrid inside a modern premium showroom, soft studio lighting, EuroDrive logo blurred, front three-quarter view, professional car photography, 16:9',
  },
  {
    make: 'Land Rover', model: 'Range Rover Velar P250', year: 2025,
    bodyType: 'SUV', fuelType: 'PETROL', transmission: 'AUTOMATIC',
    power: 250, engineSize: 2.0, mileage: 0, condition: 'NEW',
    basePrice: 63000, taxRate: 0.14, customsRate: 0.04, status: 'AVAILABLE',
    photos: mkVariants([
      ['Santorini Black', '#1A1A1A', 'lr-velar-p250-blk', 'lr-velar-p250-blk2'],
      ['Fuji White', '#F5F5F0', 'lr-velar-p250-wht'],
      ['Lantau Bronze Metallic', '#8B7355', 'lr-velar-p250-brz'],
    ]),
    features: ['Pivi Pro 11.4" Touchscreen', 'Interactive Driver Display 12.3"', 'LED Headlights', 'Panoramic Sunroof', 'Meridian Sound System', 'Wireless Charging', 'Air Suspension', 'Head-Up Display'],
    mjPrompt: 'Santorini Black 2025 Range Rover Velar P250 inside a stylish showroom, dramatic side lighting, dark floor, EuroDrive logo blurred on wall, side profile, professional automotive photography, cinematic, 16:9',
  },
  {
    make: 'Land Rover', model: 'Range Rover Velar P400e', year: 2025,
    bodyType: 'SUV', fuelType: 'HYBRID', transmission: 'AUTOMATIC',
    power: 404, engineSize: 2.0, mileage: 0, condition: 'NEW',
    basePrice: 75900, taxRate: 0.14, customsRate: 0.04, status: 'AVAILABLE',
    photos: mkVariants([
      ['Eiger Grey Metallic', '#6B7070', 'lr-velar-p400e-gry', 'lr-velar-p400e-gry2'],
      ['Fuji White', '#F5F5F0', 'lr-velar-p400e-wht'],
      ['Santorini Black', '#1A1A1A', 'lr-velar-p400e-blk'],
    ]),
    features: ['Plug-in Hybrid 64km Electric Range', 'Pivi Pro 11.4" Touchscreen', 'Interactive Driver Display', 'LED Headlights', 'Air Suspension', 'Meridian 3D Sound', 'Panoramic Sunroof', 'Wireless Charging'],
    mjPrompt: 'Eiger Grey Metallic 2025 Range Rover Velar P400e plug-in hybrid inside a premium showroom, soft overhead lighting, light marble floor, EuroDrive logo blurred, three-quarter front view, professional car photography, photorealistic, 16:9',
  },
  {
    make: 'Land Rover', model: 'Range Rover Sport P300', year: 2025,
    bodyType: 'SUV', fuelType: 'PETROL', transmission: 'AUTOMATIC',
    power: 300, engineSize: 3.0, mileage: 0, condition: 'NEW',
    basePrice: 83900, taxRate: 0.14, customsRate: 0.04, status: 'AVAILABLE',
    photos: mkVariants([
      ['Portofino Blue', '#1E3A5F', 'lr-rrs-p300-blu', 'lr-rrs-p300-blu2'],
      ['Fuji White', '#F5F5F0', 'lr-rrs-p300-wht'],
      ['Santorini Black', '#1A1A1A', 'lr-rrs-p300-blk'],
      ['Charente Grey', '#888B8E', 'lr-rrs-p300-gry'],
    ]),
    features: ['Dynamic Air Suspension', 'Terrain Response 2', 'Pivi Pro 13.1" Touchscreen', 'Meridian 3D Surround Sound', 'Matrix LED Headlights', 'Panoramic Sunroof', 'Head-Up Display', 'Rear Entertainment'],
    mjPrompt: 'Portofino Blue 2025 Range Rover Sport P300 inside a luxury automotive showroom, dramatic lighting, dark reflective floor, EuroDrive logo blurred on wall, three-quarter front view, professional automotive photography, cinematic, 16:9',
  },
  {
    make: 'Land Rover', model: 'Range Rover Sport P460e', year: 2025,
    bodyType: 'SUV', fuelType: 'HYBRID', transmission: 'AUTOMATIC',
    power: 460, engineSize: 3.0, mileage: 0, condition: 'NEW',
    basePrice: 101000, taxRate: 0.14, customsRate: 0.04, status: 'AVAILABLE',
    photos: mkVariants([
      ['Santorini Black', '#1A1A1A', 'lr-rrs-p460e-blk', 'lr-rrs-p460e-blk2'],
      ['Fuji White', '#F5F5F0', 'lr-rrs-p460e-wht'],
      ['Eiger Grey Metallic', '#6B7070', 'lr-rrs-p460e-gry'],
    ]),
    features: ['Plug-in Hybrid 113km Electric Range', 'Dynamic Air Suspension', 'Pivi Pro 13.1" Touchscreen', 'Meridian 3D Sound', 'Matrix LED Headlights', 'Panoramic Sunroof', 'Head-Up Display', 'Massage Seats'],
    mjPrompt: 'Santorini Black 2025 Range Rover Sport P460e plug-in hybrid inside a luxury showroom, dramatic low-key lighting, dark marble floor, EuroDrive logo blurred, three-quarter front view, cinematic automotive photography, 16:9',
    mjPromptFeatured: true,
  },
  {
    make: 'Land Rover', model: 'Range Rover P460e', year: 2025,
    bodyType: 'SUV', fuelType: 'HYBRID', transmission: 'AUTOMATIC',
    power: 460, engineSize: 3.0, mileage: 0, condition: 'NEW',
    basePrice: 122000, taxRate: 0.14, customsRate: 0.04, status: 'AVAILABLE',
    photos: mkVariants([
      ['Rossello Red', '#8B1A1A', 'lr-rr-p460e-red', 'lr-rr-p460e-red2'],
      ['Fuji White', '#F5F5F0', 'lr-rr-p460e-wht'],
      ['Santorini Black', '#1A1A1A', 'lr-rr-p460e-blk'],
    ]),
    features: ['Plug-in Hybrid 113km Electric Range', 'SV Bespoke Cabin', 'Dynamic Air Suspension', 'Pivi Pro 13.1" Touchscreen', 'Meridian Signature Sound', 'Matrix LED Headlights', 'Panoramic Sunroof', 'Massage Seats All-Round'],
    mjPrompt: 'Rossello Red 2025 Range Rover P460e luxury plug-in hybrid SUV inside an ultra-premium showroom, dramatic studio lighting, dark marble floor, EuroDrive logo blurred on wall, three-quarter front view, cinematic automotive photography, 16:9',
    mjPromptFeatured: true,
  },
  {
    make: 'Land Rover', model: 'Range Rover P530', year: 2025,
    bodyType: 'SUV', fuelType: 'PETROL', transmission: 'AUTOMATIC',
    power: 530, engineSize: 4.4, mileage: 0, condition: 'NEW',
    basePrice: 150000, taxRate: 0.14, customsRate: 0.04, status: 'AVAILABLE',
    photos: mkVariants([
      ['Borealis Black', '#1A1A1A', 'lr-rr-p530-blk', 'lr-rr-p530-blk2'],
      ['Fuji White', '#F5F5F0', 'lr-rr-p530-wht'],
    ]),
    features: ['4.4L V8 530hp Engine', 'SV Autobiography Specification', 'Dynamic Air Suspension', 'Pivi Pro 13.1" Touchscreen', 'Meridian Signature Sound 35-Speaker', 'Matrix LED Headlights', 'Panoramic Sunroof', 'Executive Rear Seating'],
    mjPrompt: 'Borealis Black 2025 Range Rover P530 V8 flagship luxury SUV in an ultra-luxury showroom, dramatic low-key studio lighting, white marble floor, EuroDrive logo blurred on dark wall, three-quarter front view, cinematic automotive photography, 16:9',
    mjPromptFeatured: true,
  },
];

async function main() {
  console.log('Clearing existing data…');
  await prisma.$transaction([
    prisma.trackingEvent.deleteMany(),
    prisma.vesselPosition.deleteMany(),
    prisma.shipment.deleteMany(),
    prisma.order.deleteMany(),
    prisma.carListing.deleteMany(),
  ]);

  console.log(`Seeding ${LISTINGS.length} car listings…`);
  const created = [];
  for (const raw of LISTINGS) {
    const { mjPromptFeatured, ...data } = raw;
    const listing = await prisma.carListing.create({
      data: {
        ...data,
        shippingCost: ship(data.basePrice),
      },
    });
    created.push(listing);
    process.stdout.write('.');
  }
  console.log(`\nCreated ${created.length} listings.`);

  // Demo order on first Mercedes listing
  const demoListing = created[0];
  const order = await prisma.order.create({
    data: {
      listingId: demoListing.id,
      customerName: 'Ahmed Hassan',
      customerEmail: 'ahmed.hassan@example.com',
      customerPhone: '+20 100 123 4567',
      totalPrice: Math.round(demoListing.basePrice * (1 + 0.14 + 0.04) + demoListing.shippingCost + demoListing.basePrice * 0.3),
      status: 'OCEAN_TRANSIT',
      shipment: {
        create: {
          vesselName: 'MSC AURORA',
          voyageNumber: 'AX2025-08',
          portOfLoading: 'Hamburg, Germany',
          portOfDischarge: 'Alexandria, Egypt',
          departed: new Date('2025-12-01T08:00:00Z'),
          eta: new Date('2026-01-05T06:00:00Z'),
        },
      },
    },
  });

  await prisma.trackingEvent.createMany({
    data: [
      { orderId: order.id, milestone: 'PURCHASED',      description: 'Order confirmed and payment received.', location: 'Cairo, Egypt',       timestamp: new Date('2025-11-20T10:30:00Z') },
      { orderId: order.id, milestone: 'INLAND_TO_PORT', description: 'Vehicle dispatched from dealer to port.', location: 'Stuttgart, Germany', timestamp: new Date('2025-11-28T09:00:00Z') },
      { orderId: order.id, milestone: 'LOADING',        description: 'Vehicle loaded onto MSC AURORA.', location: 'Hamburg, Germany',           timestamp: new Date('2025-12-01T14:00:00Z') },
      { orderId: order.id, milestone: 'OCEAN_TRANSIT',  description: 'Vessel departed Hamburg. Estimated 35 days at sea.', location: 'North Sea', timestamp: new Date('2025-12-02T06:00:00Z') },
    ],
  });

  console.log(`Demo order created: ${order.id}`);
  console.log('Seed complete.');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
