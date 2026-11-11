import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import HoleDetailsForm from '../../components/HoleDetailsForm/HoleDetailsForm'
import CustomerInfoForm from '../../components/CustomerInfoForm/CustomerInfoForm'
import PaymentReview from '../../components/PaymentReview/PaymentReview'
import type { FlagPosition } from '../../components/FlagPlacement/FlagPlacement'
import type { OrderDetails } from '../../lib/api'
import { COURSE_OPTIONS } from '../../lib/courses'
import { trackViewItem, trackBeginCheckout } from '../../lib/analytics'
import { getCoursePriceCents, getShippingOption, getTotalCents } from '../../lib/pricing'
import './Order.css'

const INITIAL_ORDER: OrderDetails = {
  course: '',
  hole: '',
  golferName: '',
  date: '',
  yardage: '',
  club: '',
  flagX: 50,
  flagY: 50,
  flagColor: '',
  bentTeeColor: '',
  straightTeeColor: '',
  tbmColor: '',
  name: '',
  email: '',
  phone: '',
  street: '',
  city: '',
  state: '',
  zip: '',
  shippingMethod: 'standard',
  promoCode: '',
}

const STEP_LABELS = ['Your Personalized Celebration', 'Order Information', 'Payment']

// Typing this exact golfer name fills in the rest of the form with a test data set.
const TEST_GOLFER_NAME = 'james carter'

const TEST_ORDER: Partial<OrderDetails> = {
  course: 'DeLaveaga Golf Course (Hole 5)',
  hole: '5',
  date: '2025-11-12',
  yardage: '153',
  club: '6 Iron',
  flagX: 50,
  flagY: 50,
  flagColor: 'Blue',
  bentTeeColor: 'Blue',
  straightTeeColor: 'Blue',
  tbmColor: 'Blue',
  name: 'James Green',
  email: 'jim.green94303@gmail.com',
  phone: '408.480.3477',
  street: '123 Fairway Dr',
  city: 'Santa Cruz',
  state: 'CA',
  zip: '95060',
  shippingMethod: 'standard',
}

function Order() {
  const [searchParams] = useSearchParams()

  const [order, setOrder] = useState<OrderDetails>(() => {
    const courseParam = searchParams.get('course')
    const holeParam = searchParams.get('hole')

    return {
      ...INITIAL_ORDER,
      course: courseParam && COURSE_OPTIONS.some((o) => o.label === courseParam) ? courseParam : INITIAL_ORDER.course,
      hole: holeParam ?? INITIAL_ORDER.hole,
    }
  })
  const [step, setStep] = useState(1)

  // GA4: view_item on first mount — user is browsing the order page
  useEffect(() => {
    const priceCents = getCoursePriceCents(order.course || COURSE_OPTIONS[0]?.label || '')
    trackViewItem({
      courseName: order.course || undefined,
      priceCents,
    })
    // Only fires once on mount — intentionally omitting order from deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleFieldChange = (field: keyof OrderDetails, value: string) => {
    if (field === 'golferName' && value.trim().toLowerCase() === TEST_GOLFER_NAME) {
      setOrder((previous) => ({ ...previous, ...TEST_ORDER, golferName: value }))
      return
    }
    setOrder((previous) => ({ ...previous, [field]: value }))
  }

  const handleFlagChange = (position: FlagPosition) => {
    setOrder((previous) => ({ ...previous, flagX: position.x, flagY: position.y }))
  }

  // GA4: begin_checkout when user advances from Step 2 → Step 3
  const handleGoToPayment = () => {
    const shippingOption = getShippingOption(order.shippingMethod, order.course)
    const totalCents = getTotalCents(order.course, order.shippingMethod, order.promoCode)
    trackBeginCheckout({
      course: order.course,
      hole: order.hole,
      totalCents,
      shippingCents: shippingOption.priceCents,
      coupon: order.promoCode || undefined,
    })
    setStep(3)
  }

  return (
    <main className="order">
      <div className="order__inner">
        <ol className="order__stepper">
          {STEP_LABELS.map((label, index) => (
            <li
              key={label}
              className={
                index + 1 === step
                  ? 'order__step order__step--active'
                  : index + 1 < step
                    ? 'order__step order__step--complete'
                    : 'order__step'
              }
            >
              {label}
            </li>
          ))}
        </ol>

        <div className="order__card">
          {step === 1 && (
            <HoleDetailsForm
              order={order}
              onFieldChange={handleFieldChange}
              onFlagChange={handleFlagChange}
              onNext={() => setStep(2)}
            />
          )}

          {step === 2 && (
            <CustomerInfoForm
              order={order}
              onFieldChange={handleFieldChange}
              onBack={() => setStep(1)}
              onNext={handleGoToPayment}
            />
          )}

          {step === 3 && <PaymentReview order={order} onBack={() => setStep(2)} />}
        </div>
      </div>
    </main>
  )
}

export default Order
