import { useEffect, useState } from 'react'
import delaveagaImg from '../../assets/hero-delaveaga-5.png'
import seabrightImg from '../../assets/seabright.png'
import closeupImg from '../../assets/closeup.jpeg'
import carouselImg1 from '../../assets/Image1.jpg'
import carouselImg2 from '../../assets/Image2.JPG'
import carouselImg3 from '../../assets/Image3.JPG'
import carouselImg4 from '../../assets/Image6.JPG'
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

// Three copies of the slides so the track always has neighbors on both sides, no matter the active index.
const LOOPED_SLIDES = [0, 1, 2].flatMap((copy) =>
  CAROUSEL_SLIDES.map((slide, index) => ({
    ...slide,
    key: `${copy}-${slide.id}`,
    originalIndex: index,
  })),
)

function Gallery() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  useEffect(() => {
    if (isPaused) return

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % SLIDE_COUNT)
    }, SLIDE_INTERVAL_MS)

    return () => window.clearInterval(timer)
  }, [isPaused])

  useEffect(() => {
    if (!isLightboxOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsLightboxOpen(false)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isLightboxOpen])

  const goToSlide = (index: number) => {
    setActiveIndex((index + SLIDE_COUNT) % SLIDE_COUNT)
  }

  const handleSlideClick = (index: number) => {
    if (index === activeIndex) {
      setIsLightboxOpen(true)
    } else {
      goToSlide(index)
    }
  }

  // Center on the middle copy of the loop so there's always a full set of neighbors either side.
  const renderIndex = SLIDE_COUNT + activeIndex
  const trackOffset = renderIndex * ITEM_STEP + ITEM_WIDTH / 2

  return (
    <section className="gallery">
      <div className="gallery__inner">
        <h2 className="gallery__heading">Aces we've built</h2>

        <div
          className="gallery__carousel"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            className="gallery__track"
            style={{ transform: `translateX(calc(50% - ${trackOffset}px))` }}
          >
            {LOOPED_SLIDES.map((slide) => (
              <button
                type="button"
                key={slide.key}
                className={
                  slide.originalIndex === activeIndex
                    ? 'gallery__slide gallery__slide--active'
                    : 'gallery__slide'
                }
                style={{ width: `${ITEM_WIDTH}px`, marginRight: `${ITEM_GAP}px` }}
                onClick={() => handleSlideClick(slide.originalIndex)}
                aria-label={
                  slide.originalIndex === activeIndex
                    ? 'Enlarge photo'
                    : `Show photo ${slide.originalIndex + 1}`
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
            onClick={() => goToSlide(activeIndex - 1)}
          >
            ‹
          </button>
          <button
            type="button"
            className="gallery__control gallery__control--next"
            aria-label="Next slide"
            onClick={() => goToSlide(activeIndex + 1)}
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
                index === activeIndex ? 'gallery__dot gallery__dot--active' : 'gallery__dot'
              }
              onClick={() => goToSlide(index)}
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
          <img
            className="gallery__lightbox-image"
            src={CAROUSEL_SLIDES[activeIndex].src}
            alt="Completed IWI model, enlarged"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
    </section>
  )
}

export default Gallery
