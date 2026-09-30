const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4242'

export type OrderDetails = {
  course: string
  hole: string
  golferName: string
  date: string
  yardage: string
  club: string
  flagX: number
  flagY: number
  name: string
  email: string
  phone: string
  street: string
  city: string
  state: string
  zip: string
}

export async function createPaymentIntent(order: OrderDetails): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/api/create-payment-intent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order),
  })

  if (!response.ok) {
    throw new Error('Unable to start checkout. Please try again.')
  }

  const data: { clientSecret: string } = await response.json()
  return data.clientSecret
}
