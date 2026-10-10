export type Course = {
  name: string
  state: string
  /** Base product price in cents */
  priceCents: number
  /** Whether local pickup is available for this course */
  localPickup: boolean
}

export const COURSES: Course[] = [
  { name: 'DeLaveaga Golf Course',         state: 'CA', priceCents:  5000, localPickup: true  },
  { name: 'Stanford University Golf Course', state: 'CA', priceCents: 5000, localPickup: false },
  { name: 'Other' ,                        state: '',   priceCents:  5000, localPickup: true  },
]

/** Flat list of course names for use in dropdowns */
export const COURSE_OPTIONS: string[] = COURSES.map((c) => c.name)

/** Look up a course by name, returning undefined if not found. */
export function getCourse(name: string): Course | undefined {
  return COURSES.find((c) => c.name === name)
}

/** Set of course names that offer local pickup (for quick membership checks) */
export const LOCAL_PICKUP_COURSE_NAMES = new Set(
  COURSES.filter((c) => c.localPickup).map((c) => c.name),
)
