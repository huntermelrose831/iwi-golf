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
app.use(express.json())

// Only known fields are copied out of the request body to avoid mass-assignment into Stripe calls.
function pickOrderFields(body) {
  const fields = [
    'course',
    'hole',
    'golferName',
    'date',
    'yardage',
    'club',
    'flagX',
    'flagY',
    'name',
    'email',
    'phone',
    'street',
    'city',
    'state',
    'zip',
  ]

  const order = {}
  for (const field of fields) {
    const value = body?.[field]
    order[field] = typeof value === 'string' || typeof value === 'number' ? String(value) : ''
  }
  return order
}

app.post('/api/create-payment-intent', async (req, res) => {
  const order = pickOrderFields(req.body)

  if (!order.email || !order.name || !order.course || !order.hole || !order.golferName) {
    return res.status(400).json({ error: 'Missing required order fields.' })
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: UNIT_AMOUNT,
      currency: CURRENCY,
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
