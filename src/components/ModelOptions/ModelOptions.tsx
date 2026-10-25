import { MODEL_COLORS, TEE_STYLES } from '../../lib/options'
import type { TeeStyle } from '../../lib/options'
import './ModelOptions.css'

type ModelOptionsProps = {
  flagColor: string
  teeStyle: string
  teeColor: string
  onFlagColorChange: (color: string) => void
  onTeeStyleChange: (style: TeeStyle) => void
  onTeeColorChange: (color: string) => void
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
  teeStyle,
  teeColor,
  onFlagColorChange,
  onTeeStyleChange,
  onTeeColorChange,
}: ModelOptionsProps) {
  return (
    <div className="model-options">
      <div className="model-options__group">
        <p className="model-options__heading">
          <span className="model-options__required">*</span> Flag color
          {flagColor && <span className="model-options__chosen">{flagColor}</span>}
        </p>
        <Swatches legend="Flag color" selected={flagColor} onSelect={onFlagColorChange} />
      </div>

      <div className="model-options__group">
        <p className="model-options__heading">
          <span className="model-options__required">*</span> Tee style
        </p>
        <div className="model-options__styles">
          {TEE_STYLES.map((style) => (
            <button
              key={style.id}
              type="button"
              aria-pressed={teeStyle === style.id}
              className={
                teeStyle === style.id
                  ? 'model-options__style model-options__style--selected'
                  : 'model-options__style'
              }
              onClick={() => onTeeStyleChange(style.id)}
            >
              <span className="model-options__style-label">{style.label}</span>
              <span className="model-options__style-desc">{style.description}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="model-options__group">
        <p className="model-options__heading">
          <span className="model-options__required">*</span> Tee color
          {teeColor && <span className="model-options__chosen">{teeColor}</span>}
        </p>
        <Swatches legend="Tee color" selected={teeColor} onSelect={onTeeColorChange} />
      </div>
    </div>
  )
}

export default ModelOptions

