import './FlagPlacement.css'

const NUDGE_AMOUNT = 6
const MIN_POSITION = 12
const MAX_POSITION = 88
const CENTER_POSITION = 50

export type FlagPosition = {
  x: number
  y: number
}

type FlagPlacementProps = {
  value: FlagPosition
  onChange: (position: FlagPosition) => void
}

function clamp(value: number) {
  return Math.min(MAX_POSITION, Math.max(MIN_POSITION, value))
}

function FlagPlacement({ value, onChange }: FlagPlacementProps) {
  const nudge = (deltaX: number, deltaY: number) => {
    onChange({ x: clamp(value.x + deltaX), y: clamp(value.y + deltaY) })
  }

  const reset = () => {
    onChange({ x: CENTER_POSITION, y: CENTER_POSITION })
  }

  return (
    <div className="flag-placement">
      <p className="flag-placement__heading">Flag placement</p>
      <p className="flag-placement__description">
        By default the flag sits at the center of the green. The green below is just a
        typical green. Use the arrows to nudge the flag to roughly where the pin was.
      </p>
      <div className="flag-placement__board">
        <button
          type="button"
          className="flag-placement__nudge flag-placement__nudge--up"
          aria-label="Move flag up"
          onClick={() => nudge(0, -NUDGE_AMOUNT)}
        >
          ↑
        </button>
        <button
          type="button"
          className="flag-placement__nudge flag-placement__nudge--left"
          aria-label="Move flag left"
          onClick={() => nudge(-NUDGE_AMOUNT, 0)}
        >
          ←
        </button>
        <button
          type="button"
          className="flag-placement__nudge flag-placement__nudge--right"
          aria-label="Move flag right"
          onClick={() => nudge(NUDGE_AMOUNT, 0)}
        >
          →
        </button>
        <button
          type="button"
          className="flag-placement__nudge flag-placement__nudge--down"
          aria-label="Move flag down"
          onClick={() => nudge(0, NUDGE_AMOUNT)}
        >
          ↓
        </button>

        <div className="flag-placement__green">
          <div className="flag-placement__fringe" aria-hidden="true" />
          <span
            className="flag-placement__flag"
            style={{ left: `${value.x}%`, top: `${value.y}%` }}
            aria-hidden="true"
          >
            ⚑
          </span>
        </div>

        <button
          type="button"
          className="flag-placement__reset"
          onClick={reset}
        >
          Reset to center
        </button>
      </div>
    </div>
  )
}

export default FlagPlacement
