import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('admin123', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      passwordHash,
      name: 'Admin User',
      role: Role.ADMIN,
    },
  });

  console.log(`Seeded admin: ${admin.email}`);

  // Demo customer + order + shipment for development
  const customerHash = await bcrypt.hash('customer123', 12);
  const customer = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      email: 'customer@example.com',
      passwordHash: customerHash,
      name: 'Demo Customer',
      role: Role.CUSTOMER,
    },
  });

  console.log(`Seeded customer: ${customer.email}`);

  const existingOrder = await prisma.order.findFirst({ where: { userId: customer.id } });
  if (!existingOrder) {
    const order = await prisma.order.create({
      data: {
        userId: customer.id,
        carModel: 'BMW M3 Competition',
        configuration: {
          color: 'Brooklyn Grey',
          interior: 'Merino Leather Black',
          transmission: 'M Steptronic',
          packages: ['M Driver\'s Package', 'Harman Kardon Sound'],
        },
        totalPrice: 89450,
        status: 'SHIPPING',
      },
    });

    const shipment = await prisma.shipment.create({
      data: {
        orderId: order.id,
        billOfLading: 'MAEU123456789',
        vesselImo: '9299860',
        currentMilestone: 'OCEAN_TRANSIT',
      },
    });

    await prisma.trackingEvent.createMany({
      data: [
        {
          shipmentId: shipment.id,
          milestone: 'PURCHASED',
          timestamp: new Date('2026-04-01T10:00:00Z'),
          notes: 'Order confirmed and payment processed.',
        },
        {
          shipmentId: shipment.id,
          milestone: 'INLAND_TO_PORT',
          timestamp: new Date('2026-04-10T08:30:00Z'),
          notes: 'Vehicle dispatched from Munich factory to Hamburg port.',
          gpsLat: 53.5511,
          gpsLng: 9.9937,
        },
        {
          shipmentId: shipment.id,
          milestone: 'LOADING',
          timestamp: new Date('2026-04-15T14:00:00Z'),
          notes: 'Loaded onto vessel MAERSK ELBA at Hamburg.',
          gpsLat: 53.5396,
          gpsLng: 9.9822,
          vesselName: 'MAERSK ELBA',
        },
        {
          shipmentId: shipment.id,
          milestone: 'OCEAN_TRANSIT',
          timestamp: new Date('2026-04-16T06:00:00Z'),
          notes: 'Vessel departed Hamburg. ETA: 28 days.',
          gpsLat: 54.2,
          gpsLng: 8.5,
          vesselName: 'MAERSK ELBA',
        },
      ],
    });

    console.log(`Seeded demo order ${order.id} with shipment and tracking events.`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
