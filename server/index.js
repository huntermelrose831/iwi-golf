const path = require('node:path')
require('dotenv').config({ path: path.join(__dirname, '.env') })

const express = require('express')
const cors = require('cors')
const Stripe = require('stripe')
const crypto = require('node:crypto')
const { chmod, readFile, rename, writeFile } = require('node:fs/promises')

const stripe = Stripe(process.env.STRIPE_SECRET_KEY)

const PORT = process.env.PORT || 4242
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173'
const CURRENCY = process.env.STRIPE_CURRENCY || 'usd'
const DEFAULT_PRODUCT_PRICE_CENTS = 5000
const SHIPPING_RATES = { pickup: 0, standard: 1500 }

// Mirrors src/lib/courses.ts — keep in sync when courses change.
const COURSE_PRICES = {
  'Boulder Creek Golf Course':       3500,
  'Deep Cliff Golf Course':          3500,
  'DeLaveaga Golf Course':           5000,
  'Door Creek Golf Course':          5000,
  'FireFly Golf Links':              5000,
  'Glen Hills Country Club':         5000,
  'Los Lagos Golf Course':           5000,
  'Los Verdes Golf Course':          5000,
  'Moffett Field Golf Club':         5000,
  'Odana Hills Golf Course':         5000,
  'Pajaro Valley Golf Club':         5000,
  'Pasatiempo Golf Club':            9500,
  'Pebble Beach Golf Links':        18000,
  'Pruneridge Golf Club':            3500,
  'Recreation Park Golf Course':     5000,
  'Seabright Country Club':          5000,
  'Seascape Golf Club':              5000,
  'Spyglass Hill Golf Course':      12500,
  'Stanford University Golf Course': 5000,
  'Sunken Gardens Golf Course':      3500,
}

function getCoursePriceCents(courseName) {
  return COURSE_PRICES[courseName] ?? DEFAULT_PRODUCT_PRICE_CENTS
}

function getShippingCents(courseName, shippingMethod) {
  if (courseName === 'Pebble Beach Golf Links' && shippingMethod === 'standard') {
    return 0
  }
  return SHIPPING_RATES[shippingMethod] ?? SHIPPING_RATES.standard
}

function getTotalCents(courseName, shippingMethod) {
  return getCoursePriceCents(courseName) + getShippingCents(courseName, shippingMethod)
}

const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET

const ORDER_NOTIFICATION_EMAIL = process.env.ORDER_NOTIFICATION_EMAIL
const MS_TENANT_ID = process.env.MS_TENANT_ID
const MS_CLIENT_ID = process.env.MS_CLIENT_ID
const MS_CLIENT_SECRET = process.env.MS_CLIENT_SECRET
const SENDER_EMAIL = process.env.SENDER_EMAIL || 'admin@iwi.golf'
const MS_REFRESH_TOKEN_PATH = path.join(__dirname, '.ms-refresh-token')

// Password-only site gate: visitors enter just a password (no username) before
// reaching the app. See public/gate.html and the nginx auth_request config.
const SITE_GATE_PASSWORD = process.env.SITE_GATE_PASSWORD
const SITE_GATE_SECRET = process.env.SITE_GATE_SECRET
const GATE_COOKIE_NAME = 'iwi_gate'
const GATE_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000 // 30 days
let cachedAccessToken = null
let accessTokenExpiresAt = 0
let refreshInFlight = null

async function getGraphAccessToken() {
  if (cachedAccessToken && Date.now() < accessTokenExpiresAt) return cachedAccessToken
  if (refreshInFlight) return refreshInFlight

  refreshInFlight = (async () => {
    if (!MS_TENANT_ID || !MS_CLIENT_ID || !MS_CLIENT_SECRET) {
      throw new Error('Microsoft Graph credentials are not configured.')
    }

    let refreshToken
    try {
      refreshToken = (await readFile(MS_REFRESH_TOKEN_PATH, 'utf8')).trim()
    } catch (error) {
      if (error.code !== 'ENOENT') throw error
      refreshToken = process.env.MS_REFRESH_TOKEN
    }

    if (!refreshToken) throw new Error('Microsoft Graph refresh token is not configured.')

    const tokenResponse = await fetch(
      `https://login.microsoftonline.com/${encodeURIComponent(MS_TENANT_ID)}/oauth2/v2.0/token`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: MS_CLIENT_ID,
          client_secret: MS_CLIENT_SECRET,
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
        }),
      },
    )
    const tokenData = await tokenResponse.json()

    if (!tokenResponse.ok || !tokenData.access_token) {
      throw new Error(
        `Microsoft token request failed (${tokenResponse.status}): ${tokenData.error_description || tokenData.error || 'unknown error'}`,
      )
    }

    if (tokenData.refresh_token && tokenData.refresh_token !== refreshToken) {
      const temporaryPath = `${MS_REFRESH_TOKEN_PATH}.${process.pid}.tmp`
      await writeFile(temporaryPath, tokenData.refresh_token, { mode: 0o600 })
      await chmod(temporaryPath, 0o600)
      await rename(temporaryPath, MS_REFRESH_TOKEN_PATH)
    }

    cachedAccessToken = tokenData.access_token
    accessTokenExpiresAt = Date.now() + Math.max(Number(tokenData.expires_in || 3600) - 60, 60) * 1000
    return cachedAccessToken
  })().finally(() => {
    refreshInFlight = null
  })

  return refreshInFlight
}

async function sendGraphEmail({ subject, text, html, replyTo, toAddress }) {
  if (!ORDER_NOTIFICATION_EMAIL) throw new Error('Order notification email is not configured.')

  const accessToken = await getGraphAccessToken()
  const message = {
    subject,
    body: {
      contentType: html ? 'HTML' : 'Text',
      content: html || text,
    },
    toRecipients: [{ emailAddress: { address: toAddress || ORDER_NOTIFICATION_EMAIL } }],
  }

  if (replyTo) {
    message.replyTo = [{ emailAddress: { address: replyTo } }]
  }

  const response = await fetch(
    `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(SENDER_EMAIL)}/sendMail`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, saveToSentItems: true }),
    },
  )

  if (response.status !== 202) {
    const details = (await response.text()).slice(0, 1000)
    throw new Error(`Microsoft Graph sendMail failed (${response.status}): ${details}`)
  }
}

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
      await sendCustomerReceiptEmail(order).catch((error) => {
        console.error('Failed to send customer receipt email:', error.message)
      })
    }

    res.json({ received: true })
  },
)

app.use(cors({ origin: CLIENT_URL }))
app.use(express.json({ limit: '10kb' }))

// Signs an expiry-stamped token so the gate cookie can't be forged or replayed past its TTL.
function signGateToken() {
  const expiresAt = Date.now() + GATE_TOKEN_TTL_MS
  const signature = crypto.createHmac('sha256', SITE_GATE_SECRET).update(String(expiresAt)).digest('hex')
  return `${expiresAt}.${signature}`
}

function isValidGateToken(token) {
  if (!SITE_GATE_SECRET || !token) return false
  const [expiresAt, signature] = String(token).split('.')
  if (!expiresAt || !signature) return false

  const expected = crypto.createHmac('sha256', SITE_GATE_SECRET).update(expiresAt).digest('hex')
  const actualBuffer = Buffer.from(signature)
  const expectedBuffer = Buffer.from(expected)
  if (actualBuffer.length !== expectedBuffer.length) return false
  if (!crypto.timingSafeEqual(actualBuffer, expectedBuffer)) return false

  return Number(expiresAt) > Date.now()
}

function parseCookies(header) {
  const cookies = {}
  if (!header) return cookies
  for (const part of header.split(';')) {
    const separatorIndex = part.indexOf('=')
    if (separatorIndex === -1) continue
    const key = part.slice(0, separatorIndex).trim()
    const value = part.slice(separatorIndex + 1).trim()
    cookies[key] = decodeURIComponent(value)
  }
  return cookies
}

// Checked by nginx (auth_request) before every page load; 200 lets the request through, 401 bounces to the gate.
app.get('/api/gate/check', (req, res) => {
  const cookies = parseCookies(req.headers.cookie)
  if (isValidGateToken(cookies[GATE_COOKIE_NAME])) {
    return res.status(200).end()
  }
  res.status(401).end()
})

// Password-only login: no username field, just a shared password set via SITE_GATE_PASSWORD.
app.post('/api/gate/login', (req, res) => {
  if (!SITE_GATE_PASSWORD || !SITE_GATE_SECRET) {
    return res.status(503).json({ error: 'Site gate is not configured.' })
  }

  const provided = Buffer.from(sanitizeString(req.body?.password))
  const expected = Buffer.from(SITE_GATE_PASSWORD)
  const matches = provided.length === expected.length && crypto.timingSafeEqual(provided, expected)

  if (!matches) {
    return res.status(401).json({ error: 'Incorrect password.' })
  }

  const isHttps = req.secure || req.headers['x-forwarded-proto'] === 'https'
  const token = signGateToken()
  res.setHeader(
    'Set-Cookie',
    `${GATE_COOKIE_NAME}=${token}; Path=/; Max-Age=${Math.floor(GATE_TOKEN_TTL_MS / 1000)}; HttpOnly; SameSite=Lax${isHttps ? '; Secure' : ''}`,
  )
  res.json({ ok: true })
})

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

// Same trim/strip rules as sanitizeString, just with a longer cap for free-text messages.
const MAX_MESSAGE_LENGTH = 2000
function sanitizeMessage(value) {
  if (typeof value !== 'string') return ''
  return value
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .trim()
    .slice(0, MAX_MESSAGE_LENGTH)
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
    'shippingMethod',
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
  const productCents = getCoursePriceCents(order.course)
  const shippingCents = getShippingCents(order.course, order.shippingMethod)
  const totalCents = productCents + shippingCents

  const fmt = (cents) => `$${(cents / 100).toFixed(2)}`

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
    `Shipping: ${order.shippingMethod === 'pickup' ? 'Local Pickup' : 'Standard Shipping'}`,
    `Ship to: ${order.street || '—'}, ${order.city || '—'}, ${order.state || '—'} ${order.zip || '—'}`,
    '',
    `Product: ${fmt(productCents)}`,
    `Shipping: ${fmt(shippingCents)}`,
    `Total: ${fmt(totalCents)}`,
  ]

  await sendGraphEmail({
    subject: `New IWI order — ${order.course || 'Unknown course'} Hole ${order.hole || '?'}`,
    text: lines.join('\n'),
    replyTo: order.email || undefined,
  })
}

async function sendCustomerReceiptEmail(order) {
  if (!order.email) return

  const productCents = getCoursePriceCents(order.course)
  const shippingCents = getShippingCents(order.course, order.shippingMethod)
  const totalCents = productCents + shippingCents

  const fmt = (cents) => `$${(cents / 100).toFixed(2)}`

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h1 style="color: #2c3e50;">Thanks for your order!</h1>
      <p>Hi ${order.name || 'there'},</p>
      <p>We've received your order for the IWI 3D Printed Hole-in-One Model. We'll start crafting it soon.</p>
      
      <h2 style="color: #2c3e50; border-bottom: 1px solid #eee; padding-bottom: 10px;">Order Details</h2>
      <ul style="list-style: none; padding: 0;">
        <li><strong>Course:</strong> ${order.course || '—'}</li>
        <li><strong>Hole:</strong> ${order.hole || '—'}</li>
        <li><strong>Golfer:</strong> ${order.golferName || '—'}</li>
        <li><strong>Date:</strong> ${order.date || '—'}</li>
      </ul>

      <h2 style="color: #2c3e50; border-bottom: 1px solid #eee; padding-bottom: 10px;">Summary</h2>
      <table style="width: 100%; text-align: left; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #eee;">3D Hole-in-One Model</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right;">${fmt(productCents)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${order.shippingMethod === 'pickup' ? 'Local Pickup' : 'Standard Shipping'}</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right;">${shippingCents === 0 ? 'Free' : fmt(shippingCents)}</td>
        </tr>
        <tr>
          <td style="padding: 12px 0; font-weight: bold; font-size: 1.1em;">Total</td>
          <td style="padding: 12px 0; font-weight: bold; font-size: 1.1em; text-align: right;">${fmt(totalCents)}</td>
        </tr>
      </table>

      ${order.shippingMethod === 'pickup' 
        ? `<p style="margin-top: 30px;"><strong>Local Pickup:</strong> We'll reach out to coordinate a pickup time.</p>`
        : `<p style="margin-top: 30px;"><strong>Shipping Address:</strong><br>${order.street}<br>${order.city}, ${order.state} ${order.zip}</p>`
      }
      
      <p style="margin-top: 30px; font-size: 0.9em; color: #666;">
        If you have any questions, reply to this email or contact us through our website.
      </p>
    </div>
  `

  await sendGraphEmail({
    subject: `Your IWI Golf Order Confirmation`,
    html,
    toAddress: order.email,
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
      amount: getTotalCents(order.course, order.shippingMethod),
      currency: CURRENCY,
      // Which methods appear here (card, Apple/Google Pay, etc.) is controlled by your Stripe Dashboard settings.
      automatic_payment_methods: { enabled: true },
      description: `IWI 3D Printed Hole-in-One Model — ${order.course} — Hole ${order.hole} — ${order.golferName}`,
      metadata: order,
    })

    res.json({ clientSecret: paymentIntent.client_secret })
  } catch (error) {
    console.error('Failed to create payment intent:', error.message)
    res.status(500).json({ error: 'Unable to start checkout.' })
  }
})

app.post('/api/contact-message', async (req, res) => {
  const email = sanitizeString(req.body?.email)
  const phone = sanitizeString(req.body?.phone)
  const message = sanitizeMessage(req.body?.message)

  if (!message || (!email && !phone)) {
    return res.status(400).json({ error: 'Provide a message and either an email or phone number.' })
  }

  if (email && !EMAIL_PATTERN.test(email)) {
    return res.status(400).json({ error: 'Invalid email address.' })
  }

  try {
    await sendGraphEmail({
      subject: 'New contact form message from iwi.golf',
      text: [`Email: ${email || '—'}`, `Phone: ${phone || '—'}`, '', message].join('\n'),
      replyTo: email || undefined,
    })
    res.json({ sent: true })
  } catch (error) {
    console.error('Failed to send contact message via Microsoft Graph:', error.message)
    res.status(500).json({ error: 'Unable to send message.' })
  }
})

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.listen(PORT, () => {
  console.log(`IWI checkout server listening on http://localhost:${PORT}`)
})
