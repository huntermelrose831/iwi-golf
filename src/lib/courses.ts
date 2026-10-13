export type Course = {
  name: string
  state: string
  /** Base product price in cents */
  priceCents: number
  /** Whether local pickup is available for this course */
  localPickup: boolean
  /** Pre-set hole number for specific single-hole listings (locks the hole input) */
  hole?: string
}

export const COURSES: Course[] = [
  { name: 'DeLaveaga Golf Course',           state: 'CA', priceCents: 5000, localPickup: true,  hole: '5' },
  { name: 'Stanford University Golf Course', state: 'CA', priceCents: 5000, localPickup: false },
  { name: 'Other',                           state: '',   priceCents: 5000, localPickup: true  },
]

/**
 * Unique display labels for the course dropdown.
 * Single-hole courses show "Course Name (Hole N)".
 */
export const COURSE_OPTIONS: { label: string; course: Course }[] = [
  { label: 'DeLaveaga Golf Course (Hole 5)',           course: COURSES[0] },
  { label: 'Stanford University Golf Course (Holes 4 & 8)', course: COURSES[1] },
  { label: 'Other',                                    course: COURSES[2] },
]

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
