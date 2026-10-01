import type { ChangeEvent } from 'react'
import FlagPlacement from '../FlagPlacement/FlagPlacement'
import type { FlagPosition } from '../FlagPlacement/FlagPlacement'
import type { OrderDetails } from '../../lib/api'
import { COURSE_OPTIONS } from '../../lib/courses'
import './HoleDetailsForm.css'

const CLUB_OPTIONS = [
  'Driver',
  '3 Wood',
  '5 Wood',
  'Hybrid',
  '2 Iron',
  '3 Iron',
  '4 Iron',
  '5 Iron',
  '6 Iron',
  '7 Iron',
  '8 Iron',
  '9 Iron',
  'Pitching Wedge',
  'Gap Wedge',
  'Sand Wedge',
  'Lob Wedge',
]

type HoleDetailsFormProps = {
  order: OrderDetails
  onFieldChange: (field: keyof OrderDetails, value: string) => void
  onFlagChange: (position: FlagPosition) => void
  onNext: () => void
}

function HoleDetailsForm({ order, onFieldChange, onFlagChange, onNext }: HoleDetailsFormProps) {
  const handleInput = (field: keyof OrderDetails) => (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    onFieldChange(field, event.currentTarget.value)
  }

  return (
    <div className="hole-details-form">
      <h2 className="hole-details-form__heading">Your Personalized Celebration</h2>
      <p className="hole-details-form__subtext">Course, hole, flag</p>

      <label className="hole-details-form__field">
        <span className="hole-details-form__label">
          <span className="hole-details-form__required">*</span> Golf Course
        </span>
        <select
          className="hole-details-form__input"
          value={order.course}
          onChange={handleInput('course')}
          required
        >
          <option value="" disabled>
            Select a course…
          </option>
          {COURSE_OPTIONS.map((course) => (
            <option key={course} value={course}>
              {course}
            </option>
          ))}
        </select>
      </label>

      <div className="hole-details-form__row">
        <label className="hole-details-form__field">
          <span className="hole-details-form__label">
            <span className="hole-details-form__required">*</span> Hole Number
          </span>
          <input
            className="hole-details-form__input"
            placeholder="e.g. 7"
            value={order.hole}
            onChange={handleInput('hole')}
            maxLength={200}
            required
          />
        </label>

        <label className="hole-details-form__field">
          <span className="hole-details-form__label">
            <span className="hole-details-form__required">*</span> Golfer's Name
          </span>
          <input
            className="hole-details-form__input"
            placeholder="e.g. Jane Golfer"
            value={order.golferName}
            onChange={handleInput('golferName')}
            maxLength={200}
            required
          />
        </label>

        <label className="hole-details-form__field">
          <span className="hole-details-form__label">Hole-in-One Date</span>
          <input
            type="date"
            className="hole-details-form__input hole-details-form__input--date"
            value={order.date}
            onChange={handleInput('date')}
          />
        </label>
      </div>

      <div className="hole-details-form__row">
        <label className="hole-details-form__field">
          <span className="hole-details-form__label">Yards</span>
          <input
            className="hole-details-form__input"
            placeholder="e.g. 178"
            value={order.yardage}
            onChange={handleInput('yardage')}
            maxLength={200}
          />
        </label>

        <label className="hole-details-form__field">
          <span className="hole-details-form__label">Club Used</span>
          <select
            className="hole-details-form__input"
            value={order.club}
            onChange={handleInput('club')}
          >
            <option value="" disabled>
              Select a club…
            </option>
            {CLUB_OPTIONS.map((club) => (
              <option key={club} value={club}>
                {club}
              </option>
            ))}
          </select>
        </label>
      </div>

      <FlagPlacement value={{ x: order.flagX, y: order.flagY }} onChange={onFlagChange} />

      <button
        type="button"
        className="hole-details-form__next"
        onClick={onNext}
        disabled={!order.course || !order.hole || !order.golferName}
      >
        Next: Order Information
      </button>
    </div>
  )
}

export default HoleDetailsForm
