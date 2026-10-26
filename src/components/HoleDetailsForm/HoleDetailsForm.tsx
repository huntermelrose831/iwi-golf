import { useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import FlagPlacement from '../FlagPlacement/FlagPlacement'
import ModelOptions from '../ModelOptions/ModelOptions'
import type { FlagPosition } from '../FlagPlacement/FlagPlacement'
import type { OrderDetails } from '../../lib/api'
import { COURSE_OPTIONS, COURSE_GROUPS } from '../../lib/courses'
import './HoleDetailsForm.css'

const CLUB_OPTIONS = [
  'Driver',
  '3 Wood',
  '4 Wood',
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

const ALL_LABELS = COURSE_OPTIONS.map((o) => o.label)

function HoleDetailsForm({ order, onFieldChange, onFlagChange, onNext }: HoleDetailsFormProps) {
  const [isCustomCourse, setIsCustomCourse] = useState(
    Boolean(order.course) && !ALL_LABELS.includes(order.course),
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


  const handleCourseSelect = (event: ChangeEvent<HTMLSelectElement>) => {
    const label = event.currentTarget.value
    if (label === 'Other') {
      setIsCustomCourse(true)
      onFieldChange('course', '')
      onFieldChange('hole', '')
    } else {
      setIsCustomCourse(false)
      onFieldChange('course', label)
      // Auto-populate hole from preset if available
      const selected = COURSE_OPTIONS.find((o) => o.label === label)
      if (selected?.course.hole) {
        onFieldChange('hole', selected.course.hole)
      } else {
        onFieldChange('hole', '')
      }
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

  // Determine if the selected listing has a preset (locked) hole number
  const selectedOption = COURSE_OPTIONS.find((o) => o.label === order.course)
  const hasPresetHole = Boolean(selectedOption?.course.hole)


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
          {COURSE_GROUPS.map((group) => (
            <optgroup key={group.heading} label={group.heading}>
              {group.options.map((opt) => (
                <option key={opt.label} value={opt.label}>
                  {opt.label}
                </option>
              ))}
            </optgroup>
          ))}
          <option value="Other">Other</option>
        </select>
      </label>

      {isCustomCourse ? (
        <div className="hole-details-form__custom-notice" style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <h3 style={{ marginTop: 0, marginBottom: '0.75rem', fontSize: '1.1rem', color: '#111827' }}>Course Not Listed?</h3>
          <p style={{ margin: 0, color: '#4b5563', lineHeight: 1.5 }}>
            Since this course isn't in our system yet, please <a href="#contact" style={{ color: '#059669', textDecoration: 'underline' }}>send us a message</a> with the course name and hole number. We'll check if we can craft it and get back to you with a lead time!
          </p>
        </div>
      ) : (
        <>
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
                readOnly={hasPresetHole}
                style={hasPresetHole ? { opacity: 0.6, cursor: 'not-allowed' } : undefined}
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
              {/* Wrapper positions the invisible date input directly over the styled button.
                  iOS Safari requires a direct tap on the <input> to open the native date picker —
                  showPicker() and focus() don't work on iPhone. */}
              <span className="hole-details-form__date-wrapper">
                <span className="hole-details-form__date-button" aria-hidden="true">
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
                </span>
                <input
                  ref={dateInputRef}
                  type="date"
                  className="hole-details-form__date-input-overlay"
                  value={order.date}
                  onChange={handleInput('date')}
                  onClick={(e) => {
                    // On desktop Chromium (Chrome/Edge on Windows), clicking an invisible input focuses it
                    // but does not open the calendar popup unless showPicker() is explicitly called.
                    const target = e.currentTarget
                    if (typeof target.showPicker === 'function') {
                      try {
                        target.showPicker()
                      } catch {
                        // ignore if already showing or unsupported
                      }
                    }
                  }}
                  aria-label="Choose hole-in-one date"
                />
              </span>{/* end date-wrapper */}
              <span className="hole-details-form__hint hole-details-form__hint--date">
                Had your ace years ago? Tap the box above to select the date, any year works.
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

          <div className="hole-details-form__customize">
            <FlagPlacement value={{ x: order.flagX, y: order.flagY }} onChange={onFlagChange} />
            <ModelOptions
              flagColor={order.flagColor}
              bentTeeColor={order.bentTeeColor}
              straightTeeColor={order.straightTeeColor}
              tbmColor={order.tbmColor}
              onFlagColorChange={(color) => onFieldChange('flagColor', color)}
              onBentTeeColorChange={(color) => onFieldChange('bentTeeColor', color)}
              onStraightTeeColorChange={(color) => onFieldChange('straightTeeColor', color)}
              onTbmColorChange={(color) => onFieldChange('tbmColor', color)}
            />
          </div>

          <button
            type="button"
            className="hole-details-form__next"
            onClick={onNext}
            disabled={
              !order.course || !order.hole || !order.golferName ||
              !order.flagColor || !order.bentTeeColor || !order.straightTeeColor || !order.tbmColor
            }
          >
            Next: Order Information
          </button>
        </>
      )}
    </div>
  )
}

export default HoleDetailsForm
