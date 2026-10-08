import { useEffect, useState } from 'react'
import delaveagaImg from '../../assets/hero-delaveaga-5.png'
import seabrightImg from '../../assets/seabright.png'
import closeupImg from '../../assets/closeup.jpeg'
import carouselImg1 from '../../assets/Image1.jpg'
import carouselImg2 from '../../assets/Image2.jpg'
import carouselImg3 from '../../assets/Image3.jpg'
import carouselImg4 from '../../assets/Image6.jpg'
import './Gallery.css'

const SLIDE_INTERVAL_MS = 4000
const ITEM_WIDTH = 240
const ITEM_GAP = 24
const ITEM_STEP = ITEM_WIDTH + ITEM_GAP

const CAROUSEL_SLIDES = [
  { id: 'delaveaga', src: delaveagaImg },
  { id: 'seabright', src: seabrightImg },
  { id: 'closeup', src: closeupImg },
  { id: 'slide-1', src: carouselImg1 },
  { id: 'slide-2', src: carouselImg2 },
  { id: 'slide-3', src: carouselImg3 },
  { id: 'slide-4', src: carouselImg4 },
]

const SLIDE_COUNT = CAROUSEL_SLIDES.length

// 11 copies — 77 slides of track — so the edge is practically unreachable.
const COPY_COUNT = 11

// Start in the middle copy so there's room to go backward too.
const INITIAL_INDEX = SLIDE_COUNT * Math.floor(COPY_COUNT / 2)

const EXTENDED_SLIDES = Array.from({ length: COPY_COUNT }, (_, copy) =>
  CAROUSEL_SLIDES.map((slide, index) => ({
    ...slide,
    key: `${copy}-${slide.id}`,
    absoluteIndex: copy * SLIDE_COUNT + index,
  })),
).flat()

function Gallery() {
  // activeIndex is never clamped — it just keeps growing or shrinking.
  const [activeIndex, setActiveIndex] = useState(INITIAL_INDEX)
  const [isPaused, setIsPaused] = useState(false)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  // The visual dot / active-slide indicator is derived from the raw index.
  const activeDotIndex = activeIndex % SLIDE_COUNT

  useEffect(() => {
    if (isPaused || isLightboxOpen) return

    const timer = window.setInterval(() => {
      setActiveIndex((current) => current + 1)
    }, SLIDE_INTERVAL_MS)

    return () => window.clearInterval(timer)
  }, [isPaused, isLightboxOpen])

  useEffect(() => {
    if (!isLightboxOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsLightboxOpen(false)
      if (event.key === 'ArrowLeft') setActiveIndex((current) => current - 1)
      if (event.key === 'ArrowRight') setActiveIndex((current) => current + 1)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isLightboxOpen])

  const handleSlideClick = (absoluteIndex: number) => {
    if (absoluteIndex === activeIndex) {
      setIsLightboxOpen(true)
    } else {
      setActiveIndex(absoluteIndex)
    }
  }

  const handleDotClick = (dotIndex: number) => {
    // Move to the nearest copy of this slide relative to the current position.
    const diff = ((dotIndex - activeDotIndex) % SLIDE_COUNT + SLIDE_COUNT) % SLIDE_COUNT
    const step = diff <= SLIDE_COUNT / 2 ? diff : diff - SLIDE_COUNT
    setActiveIndex((current) => current + step)
  }

  const trackOffset = activeIndex * ITEM_STEP + ITEM_WIDTH / 2

  return (
    <section className="gallery">
      <div className="gallery__inner">
        <h2 className="gallery__heading">You made the shot.
We'll make the model.</h2>

        <div
          className="gallery__carousel"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            className="gallery__track"
            style={{ transform: `translateX(calc(50% - ${trackOffset}px))` }}
          >
            {EXTENDED_SLIDES.map((slide) => (
              <button
                type="button"
                key={slide.key}
                className={
                  slide.absoluteIndex === activeIndex
                    ? 'gallery__slide gallery__slide--active'
                    : 'gallery__slide'
                }
                style={{ width: `${ITEM_WIDTH}px`, marginRight: `${ITEM_GAP}px` }}
                onClick={() => handleSlideClick(slide.absoluteIndex)}
                aria-label={
                  slide.absoluteIndex === activeIndex
                    ? 'Enlarge photo'
                    : `Show photo ${(slide.absoluteIndex % SLIDE_COUNT) + 1}`
                }
              >
                <img className="gallery__slide-image" src={slide.src} alt="Completed IWI model" />
              </button>
            ))}
          </div>

          <button
            type="button"
            className="gallery__control gallery__control--prev"
            aria-label="Previous slide"
            onClick={() => setActiveIndex((current) => current - 1)}
          >
            ‹
          </button>
          <button
            type="button"
            className="gallery__control gallery__control--next"
            aria-label="Next slide"
            onClick={() => setActiveIndex((current) => current + 1)}
          >
            ›
          </button>
        </div>

        <div className="gallery__dots">
          {CAROUSEL_SLIDES.map((slide, index) => (
            <button
              type="button"
              key={slide.id}
              aria-label={`Go to slide ${index + 1}`}
              className={
                index === activeDotIndex ? 'gallery__dot gallery__dot--active' : 'gallery__dot'
              }
              onClick={() => handleDotClick(index)}
            />
          ))}
        </div>
      </div>

      {isLightboxOpen && (
        <div
          className="gallery__lightbox"
          onClick={() => setIsLightboxOpen(false)}
          role="presentation"
        >
          <button
            type="button"
            className="gallery__lightbox-close"
            aria-label="Close enlarged photo"
            onClick={() => setIsLightboxOpen(false)}
          >
            ×
          </button>
          <button
            type="button"
            className="gallery__lightbox-control gallery__lightbox-control--prev"
            aria-label="Previous photo"
            onClick={(event) => {
              event.stopPropagation()
              setActiveIndex((current) => current - 1)
            }}
          >
            ‹
          </button>
          <img
            className="gallery__lightbox-image"
            src={CAROUSEL_SLIDES[activeDotIndex].src}
            alt="Completed IWI model, enlarged"
            onClick={(event) => event.stopPropagation()}
          />
          <button
            type="button"
            className="gallery__lightbox-control gallery__lightbox-control--next"
            aria-label="Next photo"
            onClick={(event) => {
              event.stopPropagation()
              setActiveIndex((current) => current + 1)
            }}
          >
            ›
          </button>
        </div>
      )}
    </section>
  )
}

export default Gallery
