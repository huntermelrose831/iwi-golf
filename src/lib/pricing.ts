// ---------------------------------------------------------------------------
// Pricing & shipping config
// Per-course prices live in courses.ts (COURSES array).
// Shipping options and pickup eligibility are also derived from courses.ts.
// ---------------------------------------------------------------------------

import { getCourse, LOCAL_PICKUP_COURSE_NAMES } from './courses'

/** Default product price in cents, used when a course is not in the list. */
export const DEFAULT_PRODUCT_PRICE_CENTS = 5000

/** Returns the product price in cents for the given course name. */
export function getCoursePriceCents(courseName: string): number {
  return getCourse(courseName)?.priceCents ?? DEFAULT_PRODUCT_PRICE_CENTS
}

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
    description: "Local pickup available in Santa Cruz, CA — we'll coordinate with you directly.",
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
 * Derived from courses.ts — do not edit here.
 */
export const LOCAL_PICKUP_COURSES = LOCAL_PICKUP_COURSE_NAMES

/** Returns the shipping option object for a given id, falling back to standard. */
export function getShippingOption(id: ShippingMethod): ShippingOption {
  return SHIPPING_OPTIONS.find((o) => o.id === id) ?? SHIPPING_OPTIONS[1]
}

/** Total charge in cents for a given course + shipping method. */
export function getTotalCents(courseName: string, shippingMethod: ShippingMethod): number {
  return getCoursePriceCents(courseName) + getShippingOption(shippingMethod).priceCents
}

/** Format cents as a USD string, e.g. 24900 → "$249.00" */
export function formatUSD(cents: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100)
}
