require('dotenv').config()

const express = require('express')
const cors = require('cors')
const Stripe = require('stripe')

const stripe = Stripe(process.env.STRIPE_SECRET_KEY)

const PORT = process.env.PORT || 4242
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173'
const CURRENCY = process.env.STRIPE_CURRENCY || 'usd'
const UNIT_AMOUNT = Number(process.env.STRIPE_UNIT_AMOUNT || 24900)

const app = express()
app.use(cors({ origin: CLIENT_URL }))
app.use(express.json({ limit: '10kb' }))

const MAX_FIELD_LENGTH = 200
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Strips control characters and caps length so no field can carry injected payloads into Stripe.
function sanitizeString(value) {
  if (typeof value !== 'string' && typeof value !== 'number') return ''
  return String(value)
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .trim()
    .slice(0, MAX_FIELD_LENGTH)
}

// Flag position must stay a 0-100 percentage; anything else falls back to center.
function sanitizePercent(value) {
  const num = Number(value)
  if (!Number.isFinite(num)) return '50'
  return String(Math.min(100, Math.max(0, num)))
}

// Only known fields are copied out of the request body to avoid mass-assignment into Stripe calls.
function pickOrderFields(body) {
  const textFields = [
    'course',
    'hole',
    'golferName',
    'date',
    'yardage',
    'club',
    'name',
    'email',
    'phone',
    'street',
    'city',
    'state',
    'zip',
  ]

  const order = {}
  for (const field of textFields) {
    order[field] = sanitizeString(body?.[field])
  }
  order.flagX = sanitizePercent(body?.flagX)
  order.flagY = sanitizePercent(body?.flagY)
  return order
}

app.post('/api/create-payment-intent', async (req, res) => {
  const order = pickOrderFields(req.body)

  if (
    !order.email ||
    !EMAIL_PATTERN.test(order.email) ||
    !order.name ||
    !order.course ||
    !order.hole ||
    !order.golferName
  ) {
    return res.status(400).json({ error: 'Missing or invalid order fields.' })
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: UNIT_AMOUNT,
      currency: CURRENCY,
      // Which methods appear here (card, Apple/Google Pay, etc.) is controlled by your Stripe Dashboard settings.
      automatic_payment_methods: { enabled: true },
      receipt_email: order.email,
      description: `IWI 3D Printed Hole-in-One Model — ${order.course} — Hole ${order.hole} — ${order.golferName}`,
      metadata: order,
    })

    res.json({ clientSecret: paymentIntent.client_secret })
  } catch (error) {
    console.error('Failed to create payment intent:', error.message)
    res.status(500).json({ error: 'Unable to start checkout.' })
  }
})

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.listen(PORT, () => {
  console.log(`IWI checkout server listening on http://localhost:${PORT}`)
})
