import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import type { OrderDetails } from '../../lib/api'
import { createPaymentIntent } from '../../lib/api'
import { stripePromise } from '../../lib/stripe'
import './PaymentReview.css'

type PaymentReviewProps = {
  order: OrderDetails
  onBack: () => void
}

function PaymentReview({ order, onBack }: PaymentReviewProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isActive = true

    createPaymentIntent(order)
      .then((secret) => {
        if (isActive) setClientSecret(secret)
      })
      .catch(() => {
        if (isActive) setError('Unable to start checkout. Please try again.')
      })

    return () => {
      isActive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="payment-review">
      <h2 className="payment-review__heading">Payment</h2>
      <p className="payment-review__subtext">Review Order</p>

      <dl className="payment-review__summary">
        <div className="payment-review__row">
          <dt className="payment-review__term">Course</dt>
          <dd className="payment-review__value">{order.course || '—'}</dd>
        </div>
        <div className="payment-review__row">
          <dt className="payment-review__term">Hole</dt>
          <dd className="payment-review__value">{order.hole || '—'}</dd>
        </div>
        <div className="payment-review__row">
          <dt className="payment-review__term">Golfer</dt>
          <dd className="payment-review__value">{order.golferName || '—'}</dd>
        </div>
        <div className="payment-review__row">
          <dt className="payment-review__term">Ship to</dt>
          <dd className="payment-review__value">
            {order.street}, {order.city}, {order.state} {order.zip}
          </dd>
        </div>
        <div className="payment-review__row">
          <dt className="payment-review__term">Contact</dt>
          <dd className="payment-review__value">
            {order.name} · {order.email}
          </dd>
        </div>
      </dl>

      {error && <p className="payment-review__error">{error}</p>}

      {clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <PaymentForm onBack={onBack} />
        </Elements>
      )}

      {!clientSecret && !error && (
        <p className="payment-review__loading">Loading payment form…</p>
      )}
    </div>
  )
}

type PaymentFormProps = {
  onBack: () => void
}

function PaymentForm({ onBack }: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!stripe || !elements) return

    setIsSubmitting(true)
    setFormError(null)

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
      confirmParams: {
        return_url: `${window.location.origin}/order/success`,
      },
    })

    if (error) {
      setFormError(error.message ?? 'Payment failed. Please try again.')
      setIsSubmitting(false)
      return
    }

    if (paymentIntent?.status === 'succeeded') {
      navigate('/order/success')
    } else {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="payment-review__form" onSubmit={handleSubmit}>
      <PaymentElement className="payment-review__element" />

      {formError && <p className="payment-review__error">{formError}</p>}

      <div className="payment-review__actions">
        <button type="button" className="payment-review__back" onClick={onBack}>
          Back
        </button>
        <button
          type="submit"
          className="payment-review__pay"
          disabled={!stripe || isSubmitting}
        >
          {isSubmitting ? 'Processing…' : 'Pay now'}
        </button>
      </div>
    </form>
  )
}

export default PaymentReview
