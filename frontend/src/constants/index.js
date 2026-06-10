export const BRAND = {
  name:    'EuroDriveEgypt',
  phone:   '+20 155 105 0018',
  phoneHref: 'tel:+201551050018',
  email:   'import@eurodrive-egypt.com',
  address: '7 Lebanon St, Mohandessin, Giza, Egypt',
  hours:   'Mon–Sat, 9am–8pm',
  license: '#EG-IMP-2014-0892',
};

export const MILESTONES = [
  { key: 'PURCHASED',          label: 'Order Placed',        icon: 'order' },
  { key: 'INLAND_TO_PORT',     label: 'Preparing Shipment',  icon: 'truck' },
  { key: 'LOADING',            label: 'Loaded onto Vessel',  icon: 'anchor' },
  { key: 'OCEAN_TRANSIT',      label: 'In Transit',          icon: 'ship' },
  { key: 'PORT_ARRIVAL',       label: 'Arrived in Egypt',    icon: 'port' },
  { key: 'CUSTOMS',            label: 'Arrived in Egypt',    icon: 'port' },
  { key: 'INLAND_TO_CUSTOMER', label: 'Arrived in Egypt',    icon: 'port' },
  { key: 'DELIVERED',          label: 'Delivered',           icon: 'check' },
];

export const TRACK_STEPS = [
  { key: 'PURCHASED',      label: 'Order Placed' },
  { key: 'INLAND_TO_PORT', label: 'Preparing' },
  { key: 'LOADING',        label: 'Loaded' },
  { key: 'OCEAN_TRANSIT',  label: 'In Transit' },
  { key: 'PORT_ARRIVAL',   label: 'Arrived' },
  { key: 'DELIVERED',      label: 'Delivered' },
];

export const MILESTONE_STEP_INDEX = {
  PURCHASED:          0,
  INLAND_TO_PORT:     1,
  LOADING:            2,
  OCEAN_TRANSIT:      3,
  PORT_ARRIVAL:       4,
  CUSTOMS:            4,
  INLAND_TO_CUSTOMER: 4,
  DELIVERED:          5,
};

export function calcFinalPrice(basePrice, shippingCost, taxRate, customsRate) {
  const duties = basePrice * (taxRate + customsRate);
  const profit = basePrice * 0.3;
  return Math.round(basePrice + shippingCost + duties + profit);
}

export function fmtPrice(eur) {
  return new Intl.NumberFormat('en-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(eur);
}

export function fmtDate(iso) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}
