export type Course = {
  name: string
  state: string
  /** Base product price in cents */
  priceCents: number
  /** Whether local pickup is available for this course */
  localPickup: boolean
  /** Whether standard (flat-rate) shipping is offered for this course */
  standardShipping: boolean
  /** Pre-set hole number(s) for specific listings (locks the hole input) */
  hole?: string
  /** Text shown in parentheses in the dropdown label, e.g. "Hole 5" */
  holeLabel?: string
}

export const COURSES: Course[] = [
  { name: 'Alta Sierra',                     state: 'CA', priceCents: 5000, localPickup: false, standardShipping: true,  hole: '15', holeLabel: 'Hole 15' },
  { name: 'DeLaveaga Golf Course',           state: 'CA', priceCents: 5000, localPickup: true,  standardShipping: false, hole: '5',  holeLabel: 'Hole 5' },
  { name: 'Moffett Field',                   state: 'CA', priceCents: 5000, localPickup: false, standardShipping: true,  hole: '7',  holeLabel: 'Hole 7' },
  { name: 'PGA West - Nick Private',         state: 'CA', priceCents: 5000, localPickup: false, standardShipping: true,  hole: '7',  holeLabel: 'Hole 7' },
  { name: 'PGA West - Norman',               state: 'CA', priceCents: 5000, localPickup: false, standardShipping: true,  hole: '4',  holeLabel: 'Hole 4' },
  { name: 'PGA West - Palmer',               state: 'CA', priceCents: 5000, localPickup: false, standardShipping: true,  hole: '15', holeLabel: 'Hole 15' },
  { name: 'PGA West - Stadium',              state: 'CA', priceCents: 5000, localPickup: false, standardShipping: true,  hole: '17', holeLabel: 'Hole 17' },
  { name: 'Seascape',                        state: 'CA', priceCents: 5000, localPickup: false, standardShipping: true,  hole: '8',  holeLabel: 'Hole 8' },
  { name: 'Stanford University Golf Course', state: 'CA', priceCents: 5000, localPickup: false, standardShipping: true,  holeLabel: 'Holes 4 & 8' },
  { name: 'Other',                           state: '',   priceCents: 5000, localPickup: true,  standardShipping: false },
]

export const STATE_NAMES: Record<string, string> = {
  CA: 'California',
}

function labelFor(course: Course): string {
  return course.holeLabel ? `${course.name} (${course.holeLabel})` : course.name
}

/**
 * Unique display labels for the course dropdown.
 * Single-hole courses show "Course Name (Hole N)".
 */
export const COURSE_OPTIONS: { label: string; course: Course }[] = COURSES.map((course) => ({
  label: labelFor(course),
  course,
}))

/** Dropdown groups: one per state (heading = full state name), listings sorted alphabetically. */
export const COURSE_GROUPS: { heading: string; options: { label: string; course: Course }[] }[] =
  Object.keys(STATE_NAMES).map((code) => ({
    heading: STATE_NAMES[code],
    options: COURSE_OPTIONS.filter((o) => o.course.state === code),
  }))

/** Look up a course by its display label, returning undefined if not found. */
export function getCourseByLabel(label: string): Course | undefined {
  return COURSE_OPTIONS.find((o) => o.label === label)?.course
}

/** Look up a course by name (returns first match), returning undefined if not found. */
export function getCourse(name: string): Course | undefined {
  return COURSES.find((c) => c.name === name)
}

/** Set of display labels that offer local pickup (for quick membership checks) */
export const LOCAL_PICKUP_COURSE_NAMES = new Set(
  COURSE_OPTIONS.filter((o) => o.course.localPickup).map((o) => o.label),
)
