// ---------------------------------------------------------------------------
// Pricing & shipping config
// Edit PRODUCT_PRICE_CENTS and SHIPPING_OPTIONS here to update rates.
// Add course names to LOCAL_PICKUP_COURSES to enable free local pickup for them.
// ---------------------------------------------------------------------------

/** Base product price in cents (e.g. 5000 = $50.00) */
export const PRODUCT_PRICE_CENTS = 5000

export type ShippingMethod = 'pickup' | 'standard'

export type ShippingOption = {
  id: ShippingMethod
  label: string
  description: string
  priceCents: number
}

/** Flat-rate shipping options shown to the customer. */
export const SHIPPING_OPTIONS: ShippingOption[] = [
  {
    id: 'pickup',
    label: 'Local Pickup',
    description: "We'll coordinate delivery with you directly.",
    priceCents: 0,
  },
  {
    id: 'standard',
    label: 'Standard Shipping',
    description: 'Flat rate — same price anywhere in the US.',
    priceCents: 1500,
  },
]

/**
 * Courses that offer local pickup.
 * Must exactly match names in COURSE_OPTIONS (courses.ts).
 */
export const LOCAL_PICKUP_COURSES = new Set([
  'DeLaveaga Golf Course',
  'Seabright Country Club',
  'Seascape Golf Club',
])

/** Returns the shipping option object for a given id, falling back to standard. */
export function getShippingOption(id: ShippingMethod): ShippingOption {
  return SHIPPING_OPTIONS.find((o) => o.id === id) ?? SHIPPING_OPTIONS[1]
}

/** Total charge in cents for a given shipping method. */
export function getTotalCents(shippingMethod: ShippingMethod): number {
  return PRODUCT_PRICE_CENTS + getShippingOption(shippingMethod).priceCents
}

/** Format cents as a USD string, e.g. 24900 → "$249.00" */
export function formatUSD(cents: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100)
}
