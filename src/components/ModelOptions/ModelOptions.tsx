import { MODEL_COLORS, TEE_STYLES } from '../../lib/options'
import './ModelOptions.css'

type ModelOptionsProps = {
  flagColor: string
  bentTeeColor: string
  straightTeeColor: string
  tbmColor: string
  onFlagColorChange: (color: string) => void
  onBentTeeColorChange: (color: string) => void
  onStraightTeeColorChange: (color: string) => void
  onTbmColorChange: (color: string) => void
}

type SwatchesProps = {
  legend: string
  selected: string
  onSelect: (color: string) => void
}

function Swatches({ legend, selected, onSelect }: SwatchesProps) {
  return (
    <div className="model-options__swatches" role="radiogroup" aria-label={legend}>
      {MODEL_COLORS.map((color) => (
        <button
          key={color.name}
          type="button"
          role="radio"
          aria-checked={selected === color.name}
          aria-label={color.name}
          title={color.name}
          className={
            selected === color.name
              ? 'model-options__swatch model-options__swatch--selected'
              : 'model-options__swatch'
          }
          style={{ backgroundColor: color.hex }}
          onClick={() => onSelect(color.name)}
        />
      ))}
    </div>
  )
}

function ModelOptions({
  flagColor,
  bentTeeColor,
  straightTeeColor,
  tbmColor,
  onFlagColorChange,
  onBentTeeColorChange,
  onStraightTeeColorChange,
  onTbmColorChange,
}: ModelOptionsProps) {
  const [bent, straight] = TEE_STYLES

  return (
    <div className="model-options">
      <div className="model-options__group">
        <p className="model-options__heading">
          <span className="model-options__required">*</span> Flag color
          {flagColor && <span className="model-options__chosen">{flagColor}</span>}
        </p>
        <p className="model-options__note">
          Your flag stands in the hole on the green, right where your ball finished. Pick the
          color you'd like it to be.
        </p>
        <Swatches legend="Flag color" selected={flagColor} onSelect={onFlagColorChange} />
      </div>

      <div className="model-options__group">
        <p className="model-options__heading">
          <span className="model-options__required">*</span> {bent.label} Ball Tee color
          {bentTeeColor && <span className="model-options__chosen">{bentTeeColor}</span>}
        </p>
        <p className="model-options__intro">
          Ball Tees are what your ball rests on. Every order includes both a Bent and a Straight
          tee, and each one sits toward the corner of the model, back where you teed off. Choose
          a color for each.
        </p>
        
        <Swatches
          legend={`${bent.label} Ball Tee color`}
          selected={bentTeeColor}
          onSelect={onBentTeeColorChange}
        />
        <p className="model-options__note">{bent.description}</p>
      </div>

      <div className="model-options__group">
        <p className="model-options__heading">
          <span className="model-options__required">*</span> {straight.label} Ball Tee color
          {straightTeeColor && <span className="model-options__chosen">{straightTeeColor}</span>}
        </p>
        
        <Swatches
          legend={`${straight.label} Ball Tee color`}
          selected={straightTeeColor}
          onSelect={onStraightTeeColorChange}
        />
        <p className="model-options__note">{straight.description}</p>
      </div>

      <div className="model-options__group">
        <p className="model-options__heading">
          <span className="model-options__required">*</span> Tee Box Marker color
          {tbmColor && <span className="model-options__chosen">{tbmColor}</span>}
        </p>
        <p className="model-options__note">
          Shows where the golfer hit the first shot from. It will be added to the print.
        </p>
        <Swatches legend="Tee Box Marker color" selected={tbmColor} onSelect={onTbmColorChange} />
      </div>
    </div>
  )
}

export default ModelOptions
