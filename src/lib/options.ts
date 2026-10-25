/** Colors offered for both the flag and the tee. Mirrored in server/index.js. */
export const MODEL_COLORS = [
  { name: 'Blue', hex: '#2563eb' },
  { name: 'Red', hex: '#dc2626' },
  { name: 'Gold', hex: '#d4a017' },
  { name: 'Orange', hex: '#f97316' },
  { name: 'Green', hex: '#16a34a' },
  { name: 'Yellow', hex: '#facc15' },
] as const

export const COLOR_NAMES: string[] = MODEL_COLORS.map((c) => c.name)

export type TeeStyle = 'bent' | 'straight'

export const TEE_STYLES: { id: TeeStyle; label: string; description: string }[] = [
  { id: 'bent', label: 'Bent', description: 'For hanging on the wall' },
  { id: 'straight', label: 'Straight', description: 'For laying flat on a desk' },
]

