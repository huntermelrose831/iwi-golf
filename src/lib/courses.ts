export type Course = {
  name: string
  state: string
  /** Base product price in cents */
  priceCents: number
  /** Whether local pickup is available for this course */
  localPickup: boolean
}

export const COURSES: Course[] = [
  { name: 'Boulder Creek Golf Course',     state: 'CA', priceCents:  3500, localPickup: true  },
  { name: 'Deep Cliff Golf Course',        state: 'CA', priceCents:  3500, localPickup: false },
  { name: 'DeLaveaga Golf Course',         state: 'CA', priceCents:  5000, localPickup: true  },
  { name: 'Door Creek Golf Course',        state: 'WI', priceCents:  5000, localPickup: false },
  { name: 'FireFly Golf Links',            state: 'MI', priceCents:  5000, localPickup: false },
  { name: 'Glen Hills Country Club',       state: 'WI', priceCents:  5000, localPickup: false },
  { name: 'Los Lagos Golf Course',         state: 'CA', priceCents:  5000, localPickup: false },
  { name: 'Los Verdes Golf Course',        state: 'CA', priceCents:  5000, localPickup: false },
  { name: 'Moffett Field Golf Club',       state: 'CA', priceCents:  5000, localPickup: false },
  { name: 'Odana Hills Golf Course',       state: 'WI', priceCents:  5000, localPickup: false },
  { name: 'Pajaro Valley Golf Club',       state: 'CA', priceCents:  5000, localPickup: false },
  { name: 'Pasatiempo Golf Club',          state: 'CA', priceCents:  9500, localPickup: false },
  { name: 'Pebble Beach Golf Links',       state: 'CA', priceCents: 18000, localPickup: false },
  { name: 'Pruneridge Golf Club',          state: 'CA', priceCents:  3500, localPickup: false },
  { name: 'Recreation Park Golf Course',   state: 'CA', priceCents:  5000, localPickup: false },
  { name: 'Seabright Country Club',        state: 'CA', priceCents:  5000, localPickup: true  },
  { name: 'Seascape Golf Club',            state: 'CA', priceCents:  5000, localPickup: true  },
  { name: 'Spyglass Hill Golf Course',     state: 'CA', priceCents: 12500, localPickup: false },
  { name: 'Stanford University Golf Course', state: 'CA', priceCents: 5000, localPickup: false },
  { name: 'Sunken Gardens Golf Course',    state: 'CA', priceCents:  3500, localPickup: false },
  { name: 'Other' ,                        state: '',   priceCents:  5000, localPickup: false },
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
