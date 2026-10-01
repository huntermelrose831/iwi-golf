import type { ChangeEvent } from 'react'
import type { OrderDetails } from '../../lib/api'
import './CustomerInfoForm.css'

const STATE_OPTIONS = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN',
  'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV',
  'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN',
  'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
]

type CustomerInfoFormProps = {
  order: OrderDetails
  onFieldChange: (field: keyof OrderDetails, value: string) => void
  onBack: () => void
  onNext: () => void
}

function CustomerInfoForm({ order, onFieldChange, onBack, onNext }: CustomerInfoFormProps) {
  const handleInput = (field: keyof OrderDetails) => (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    onFieldChange(field, event.currentTarget.value)
  }

  const canContinue =
    order.name && order.email && order.street && order.city && order.state && order.zip

  return (
    <div className="customer-info-form">
      <h2 className="customer-info-form__heading">Order Information</h2>

      <label className="customer-info-form__field">
        <span className="customer-info-form__label">
          <span className="customer-info-form__required">*</span> Name
        </span>
        <input
          className="customer-info-form__input"
          placeholder="Your name"
          value={order.name}
          onChange={handleInput('name')}
          maxLength={200}
          required
        />
      </label>

      <div className="customer-info-form__row">
        <label className="customer-info-form__field">
          <span className="customer-info-form__label">
            <span className="customer-info-form__required">*</span> Email Address
          </span>
          <input
            type="email"
            className="customer-info-form__input"
            placeholder="you@example.com"
            value={order.email}
            onChange={handleInput('email')}
            maxLength={200}
            required
          />
        </label>

        <label className="customer-info-form__field">
          <span className="customer-info-form__label">Text Message (optional)</span>
          <input
            type="tel"
            className="customer-info-form__input"
            placeholder="(555) 555-5555"
            value={order.phone}
            onChange={handleInput('phone')}
            maxLength={40}
          />
        </label>
      </div>

      <p className="customer-info-form__section-label">Shipping Address</p>

      <label className="customer-info-form__field">
        <span className="customer-info-form__label">
          <span className="customer-info-form__required">*</span> Street
        </span>
        <input
          className="customer-info-form__input"
          placeholder="123 Fairway Dr, Apt 4"
          value={order.street}
          onChange={handleInput('street')}
          maxLength={200}
          required
        />
      </label>

      <div className="customer-info-form__row">
        <label className="customer-info-form__field">
          <span className="customer-info-form__label">
            <span className="customer-info-form__required">*</span> City
          </span>
          <input
            className="customer-info-form__input"
            placeholder="Santa Cruz"
            value={order.city}
            onChange={handleInput('city')}
            maxLength={100}
            required
          />
        </label>

        <label className="customer-info-form__field">
          <span className="customer-info-form__label">
            <span className="customer-info-form__required">*</span> State
          </span>
          <select
            className="customer-info-form__input"
            value={order.state}
            onChange={handleInput('state')}
            required
          >
            <option value="" disabled>
              Select…
            </option>
            {STATE_OPTIONS.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </label>

        <label className="customer-info-form__field">
          <span className="customer-info-form__label">
            <span className="customer-info-form__required">*</span> ZIP
          </span>
          <input
            className="customer-info-form__input"
            placeholder="95060"
            value={order.zip}
            onChange={handleInput('zip')}
            maxLength={12}
            required
          />
        </label>
      </div>

      <div className="customer-info-form__actions">
        <button type="button" className="customer-info-form__back" onClick={onBack}>
          Back
        </button>
        <button
          type="button"
          className="customer-info-form__next"
          onClick={onNext}
          disabled={!canContinue}
        >
          Next: Payment
        </button>
      </div>
    </div>
  )
}

export default CustomerInfoForm
