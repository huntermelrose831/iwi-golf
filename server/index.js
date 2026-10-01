require('dotenv').config()

const express = require('express')
const cors = require('cors')
const Stripe = require('stripe')
const nodemailer = require('nodemailer')

const stripe = Stripe(process.env.STRIPE_SECRET_KEY)

const PORT = process.env.PORT || 4242
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173'
const CURRENCY = process.env.STRIPE_CURRENCY || 'usd'
const UNIT_AMOUNT = Number(process.env.STRIPE_UNIT_AMOUNT || 24900)
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET
const ORDER_NOTIFICATION_EMAIL = process.env.ORDER_NOTIFICATION_EMAIL

const mailTransport =
  process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS
    ? nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 465),
        secure: Number(process.env.SMTP_PORT || 465) === 465,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      })
    : null

const app = express()

// Stripe webhooks need the raw request body for signature verification, so this route
// is registered before express.json() (which would otherwise consume/parse the body first).
app.post(
  '/api/webhooks/stripe',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    let event

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        req.headers['stripe-signature'],
        STRIPE_WEBHOOK_SECRET,
      )
    } catch (error) {
      console.error('Webhook signature verification failed:', error.message)
      return res.status(400).send('Webhook signature verification failed.')
    }

    if (event.type === 'payment_intent.succeeded') {
      const order = event.data.object.metadata || {}
      await sendOrderNotificationEmail(order).catch((error) => {
        console.error('Failed to send order notification email:', error.message)
      })
    }

    res.json({ received: true })
  },
)

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

async function sendOrderNotificationEmail(order) {
  if (!mailTransport || !ORDER_NOTIFICATION_EMAIL) return

  const lines = [
    `Course: ${order.course || '—'}`,
    `Hole: ${order.hole || '—'}`,
    `Golfer: ${order.golferName || '—'}`,
    `Date: ${order.date || '—'}`,
    `Yardage: ${order.yardage || '—'}`,
    `Club: ${order.club || '—'}`,
    `Flag position (% from top-left of green): X=${order.flagX ?? '50'}, Y=${order.flagY ?? '50'}`,
    '',
    `Customer: ${order.name || '—'}`,
    `Email: ${order.email || '—'}`,
    `Phone: ${order.phone || '—'}`,
    `Ship to: ${order.street || '—'}, ${order.city || '—'}, ${order.state || '—'} ${order.zip || '—'}`,
  ]

  await mailTransport.sendMail({
    from: process.env.SMTP_USER,
    to: ORDER_NOTIFICATION_EMAIL,
    subject: `New IWI order — ${order.course || 'Unknown course'} Hole ${order.hole || '?'}`,
    text: lines.join('\n'),
  })
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
