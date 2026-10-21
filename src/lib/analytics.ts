// Google Analytics 4 (GA4) helper for standard e-commerce events

// GA4 gtag accepts a command string plus a variable payload. We use a union
// of the two overloads we actually call so the linter sees no `any`.
type GTagCommand = 'event' | 'js' | 'config'
type GTagPayload = Record<string, string | number | boolean | object | undefined>

declare global {
  interface Window {
    gtag?: (command: GTagCommand, target: string | Date, params?: GTagPayload) => void
  }
}

export type GA4Item = {
  item_id?: string
  item_name: string
  price: number
  quantity: number
  item_category?: string
}

// ---------------------------------------------------------------------------
// Internal helper — normalise item shape before sending to gtag
// ---------------------------------------------------------------------------
function normaliseItem(item: GA4Item) {
  return {
    item_id: item.item_id || 'iwi-celebration-model',
    item_name: item.item_name,
    price: Number(item.price.toFixed(2)),
    quantity: item.quantity || 1,
    item_category: item.item_category || 'Golf Memorabilia',
  }
}

function gtag(command: GTagCommand, target: string | Date, params?: GTagPayload) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag(command, target, params)
  }
}

// ---------------------------------------------------------------------------
// view_item — fired when a user lands on the /order page (Step 1)
// ---------------------------------------------------------------------------
export type TrackViewItemParams = {
  courseName?: string
  priceCents: number
}

export function trackViewItem({ courseName, priceCents }: TrackViewItemParams) {
  const price = priceCents / 100
  gtag('event', 'view_item', {
    currency: 'USD',
    value: Number(price.toFixed(2)),
    items: [
      normaliseItem({
        item_id: 'iwi-celebration-model',
        item_name: courseName ? `3D Model – ${courseName}` : '3D Printed Hole-in-One Model',
        price,
        quantity: 1,
        item_category: '3D Printed Hole-in-One Model',
      }),
    ],
  })
}

// ---------------------------------------------------------------------------
// begin_checkout — fired when user enters Step 3 (Payment screen)
// ---------------------------------------------------------------------------
export type TrackBeginCheckoutParams = {
  course: string
  hole: string
  totalCents: number
  shippingCents: number
  coupon?: string
}

export function trackBeginCheckout({
  course,
  hole,
  totalCents,
  shippingCents,
  coupon,
}: TrackBeginCheckoutParams) {
  const value = totalCents / 100
  const shipping = shippingCents / 100
  gtag('event', 'begin_checkout', {
    currency: 'USD',
    value: Number(value.toFixed(2)),
    shipping: Number(shipping.toFixed(2)),
    ...(coupon ? { coupon } : {}),
    items: [
      normaliseItem({
        item_id: `model-${course ? course.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'custom'}`,
        item_name: `3D Model – ${course || 'Custom Course'} (Hole ${hole || '?'})`,
        price: (totalCents - shippingCents) / 100,
        quantity: 1,
        item_category: '3D Printed Hole-in-One Model',
      }),
    ],
  })
}

// ---------------------------------------------------------------------------
// add_shipping_info — fired when user confirms shipping choice and goes to Step 3
// ---------------------------------------------------------------------------
export type TrackAddShippingInfoParams = {
  course: string
  hole: string
  shippingLabel: string    // e.g. 'Standard Shipping'
  totalCents: number
  shippingCents: number
  coupon?: string
}

export function trackAddShippingInfo({
  course,
  hole,
  shippingLabel,
  totalCents,
  shippingCents,
  coupon,
}: TrackAddShippingInfoParams) {
  const value = totalCents / 100
  gtag('event', 'add_shipping_info', {
    currency: 'USD',
    value: Number(value.toFixed(2)),
    shipping_tier: shippingLabel,
    ...(coupon ? { coupon } : {}),
    items: [
      normaliseItem({
        item_id: `model-${course ? course.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'custom'}`,
        item_name: `3D Model – ${course || 'Custom Course'} (Hole ${hole || '?'})`,
        price: (totalCents - shippingCents) / 100,
        quantity: 1,
        item_category: '3D Printed Hole-in-One Model',
      }),
    ],
  })
}

// ---------------------------------------------------------------------------
// purchase — fired after Stripe confirms payment
// ---------------------------------------------------------------------------
export type PurchaseItem = GA4Item  // keep backward compat alias

export type TrackPurchaseParams = {
  transactionId: string
  value: number // in dollars (e.g. 50.00)
  currency?: string // default 'USD'
  shipping?: number
  items: GA4Item[]
}

/**
 * Fires the official GA4 'purchase' event.
 * Required by Google Analytics for Monetization & E-commerce reports.
 */
export function trackPurchase({
  transactionId,
  value,
  currency = 'USD',
  shipping = 0,
  items,
}: TrackPurchaseParams) {
  gtag('event', 'purchase', {
    transaction_id: transactionId,
    value: Number(value.toFixed(2)),
    currency,
    shipping: Number(shipping.toFixed(2)),
    items: items.map(normaliseItem),
  })
}

