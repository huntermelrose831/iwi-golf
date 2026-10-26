/** Colors offered for the flag, ball tee and tee box marker. Mirrored in server/index.js. */
export const MODEL_COLORS = [
  { name: 'Blue', hex: '#2563eb' },
  { name: 'Red', hex: '#dc2626' },
  { name: 'Gold', hex: '#d4a017' },
  { name: 'Orange', hex: '#f97316' },
  { name: 'Green', hex: '#16a34a' },
  { name: 'Yellow', hex: '#facc15' },
  { name: 'White', hex: '#ffffff' },
  { name: 'Black', hex: '#111111' },
] as const

export const COLOR_NAMES: string[] = MODEL_COLORS.map((c) => c.name)

/** Both ball tees are included with every order; each gets its own color. */
export const TEE_STYLES: { id: string; label: string; description: string }[] = [
  { id: 'bent', label: 'Bent', description: 'For hanging on the wall' },
  { id: 'straight', label: 'Straight', description: 'For laying flat on a desk' },
]

