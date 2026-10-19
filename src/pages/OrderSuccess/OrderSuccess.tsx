import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { stripePromise } from '../../lib/stripe'
import { trackPurchase } from '../../lib/analytics'
import './OrderSuccess.css'

function OrderSuccess() {
  const [searchParams] = useSearchParams()

  useEffect(() => {
    // When Stripe uses a 3D-Secure or bank redirect (e.g. European banks, mobile redirects),
    // it redirects the user directly to /order/success?payment_intent_client_secret=...&payment_intent=...
    const clientSecret = searchParams.get('payment_intent_client_secret')
    if (!clientSecret) return

    const trackedKey = `ga_purchase_tracked_${clientSecret}`
    if (sessionStorage.getItem(trackedKey)) return

    stripePromise.then(async (stripe) => {
      if (!stripe) return
      const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret)
      if (paymentIntent && paymentIntent.status === 'succeeded') {
        sessionStorage.setItem(trackedKey, 'true')
        trackPurchase({
          transactionId: paymentIntent.id,
          value: paymentIntent.amount / 100,
          currency: (paymentIntent.currency || 'usd').toUpperCase(),
          items: [
            {
              item_id: 'iwi-celebration-model',
              item_name: paymentIntent.description || '3D Printed Hole-in-One Model',
              price: paymentIntent.amount / 100,
              quantity: 1,
              item_category: 'Golf Memorabilia',
            },
          ],
        })
      }
    })
  }, [searchParams])

  return (
    <main className="order-success">
      <div className="order-success__inner">
        <h1 className="order-success__heading">Your order is in!</h1>
        <p className="order-success__subtext">
          Thanks for sharing your ace. We'll email you as soon as your model ships.
        </p>
        <Link to="/" className="order-success__link">
          Back to home
        </Link>
      </div>
    </main>
  )
}

export default OrderSuccess
