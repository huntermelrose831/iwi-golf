// Google Analytics 4 (GA4) helper for standard e-commerce events

declare global {
  interface Window {
    gtag?: (...args: any[]) => void
  }
}

export type PurchaseItem = {
  item_id?: string
  item_name: string
  price: number
  quantity: number
  item_category?: string
}

export type TrackPurchaseParams = {
  transactionId: string
  value: number // in dollars (e.g. 50.00)
  currency?: string // default 'USD'
  shipping?: number
  items: PurchaseItem[]
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
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', 'purchase', {
      transaction_id: transactionId,
      value: Number(value.toFixed(2)),
      currency,
      shipping: Number(shipping.toFixed(2)),
      items: items.map((item) => ({
        item_id: item.item_id || 'iwi-celebration-model',
        item_name: item.item_name,
        price: Number(item.price.toFixed(2)),
        quantity: item.quantity || 1,
        item_category: item.item_category || 'Golf Memorabilia',
      })),
    })
  }
}
