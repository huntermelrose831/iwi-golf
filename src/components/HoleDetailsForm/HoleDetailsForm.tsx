import { useRef, useState } from 'react'
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
  'Other'
]

type HoleDetailsFormProps = {
  order: OrderDetails
  onFieldChange: (field: keyof OrderDetails, value: string) => void
  onFlagChange: (position: FlagPosition) => void
  onNext: () => void
}

// order.date is stored as yyyy-mm-dd (native <input type="date"> format); shown to the user as mm/dd/yyyy.
function formatDisplayDate(isoDate: string) {
  if (!isoDate) return ''
  const [year, month, day] = isoDate.split('-')
  if (!year || !month || !day) return ''
  return `${month}/${day}/${year}`
}

function HoleDetailsForm({ order, onFieldChange, onFlagChange, onNext }: HoleDetailsFormProps) {
  const [isCustomCourse, setIsCustomCourse] = useState(
    Boolean(order.course) && !COURSE_OPTIONS.includes(order.course),
  )
  const [isCustomClub, setIsCustomClub] = useState(
    Boolean(order.club) && !CLUB_OPTIONS.includes(order.club),
  )
  const dateInputRef = useRef<HTMLInputElement>(null)

  const handleInput = (field: keyof OrderDetails) => (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    onFieldChange(field, event.currentTarget.value)
  }

  const openDatePicker = () => {
    const input = dateInputRef.current
    if (!input) return
    if (typeof input.showPicker === 'function') {
      input.showPicker()
    } else {
      input.focus()
    }
  }

  const handleCourseSelect = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.currentTarget.value
    if (value === 'Other') {
      setIsCustomCourse(true)
      onFieldChange('course', '')
    } else {
      setIsCustomCourse(false)
      onFieldChange('course', value)
    }
  }

  const handleClubSelect = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.currentTarget.value
    if (value === 'Other') {
      setIsCustomClub(true)
      onFieldChange('club', '')
    } else {
      setIsCustomClub(false)
      onFieldChange('club', value)
    }
  }

  return (
    <div className="hole-details-form">
      <h2 className="hole-details-form__heading">Your Personalized Celebration</h2>

      <label className="hole-details-form__field">
        <span className="hole-details-form__label">
          <span className="hole-details-form__required">*</span> Golf Course
        </span>
        <select
          className="hole-details-form__input"
          value={isCustomCourse ? 'Other' : order.course}
          onChange={handleCourseSelect}
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

      {isCustomCourse && (
        <label className="hole-details-form__field">
          <span className="hole-details-form__label">
            <span className="hole-details-form__required">*</span> Course Name
          </span>
          <input
            className="hole-details-form__input"
            placeholder="Enter your course name"
            value={order.course}
            onChange={handleInput('course')}
            maxLength={200}
            required
          />
        </label>
      )}

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

        <label className="hole-details-form__field hole-details-form__field--date">
          <span className="hole-details-form__label">Hole-in-One Date</span>
          <button
            type="button"
            className="hole-details-form__date-button"
            onClick={openDatePicker}
            aria-label="Choose hole-in-one date"
          >
            <svg
              className="hole-details-form__date-icon"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
            >
              <rect x="3" y="4" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.4" />
              <path d="M3 8h14" stroke="currentColor" strokeWidth="1.4" />
              <path d="M6.5 2.5v3M13.5 2.5v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            {order.date && <span>{formatDisplayDate(order.date)}</span>}
          </button>
          <input
            ref={dateInputRef}
            type="date"
            className="hole-details-form__date-input-hidden"
            value={order.date}
            onChange={handleInput('date')}
            tabIndex={-1}
            aria-hidden="true"
          />
          <span className="hole-details-form__hint hole-details-form__hint--date">
            Had your ace years ago? Click the box above to select the date, any year works.
          </span>
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
            value={isCustomClub ? 'Other' : order.club}
            onChange={handleClubSelect}
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

      {isCustomClub && (
        <label className="hole-details-form__field">
          <span className="hole-details-form__label">Club Name</span>
          <input
            className="hole-details-form__input"
            placeholder="Enter your club"
            value={order.club}
            onChange={handleInput('club')}
            maxLength={200}
          />
        </label>
      )}

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
