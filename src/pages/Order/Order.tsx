import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import HoleDetailsForm from '../../components/HoleDetailsForm/HoleDetailsForm'
import CustomerInfoForm from '../../components/CustomerInfoForm/CustomerInfoForm'
import PaymentReview from '../../components/PaymentReview/PaymentReview'
import type { FlagPosition } from '../../components/FlagPlacement/FlagPlacement'
import type { OrderDetails } from '../../lib/api'
import { COURSE_OPTIONS } from '../../lib/courses'
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
  name: '',
  email: '',
  phone: '',
  street: '',
  city: '',
  state: '',
  zip: '',
  shippingMethod: 'standard',
}

const STEP_LABELS = ['Your Personalized Celebration', 'Order Information', 'Payment']

function Order() {
  const [searchParams] = useSearchParams()

  const [order, setOrder] = useState<OrderDetails>(() => {
    const courseParam = searchParams.get('course')
    const holeParam = searchParams.get('hole')

    return {
      ...INITIAL_ORDER,
      course: courseParam && COURSE_OPTIONS.includes(courseParam) ? courseParam : INITIAL_ORDER.course,
      hole: holeParam ?? INITIAL_ORDER.hole,
    }
  })
  const [step, setStep] = useState(1)

  const handleFieldChange = (field: keyof OrderDetails, value: string) => {
    setOrder((previous) => ({ ...previous, [field]: value }))
  }

  const handleFlagChange = (position: FlagPosition) => {
    setOrder((previous) => ({ ...previous, flagX: position.x, flagY: position.y }))
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
              onNext={() => setStep(3)}
            />
          )}

          {step === 3 && <PaymentReview order={order} onBack={() => setStep(2)} />}
        </div>
      </div>
    </main>
  )
}

export default Order
