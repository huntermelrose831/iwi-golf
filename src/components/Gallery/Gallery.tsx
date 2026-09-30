import { useEffect, useState } from 'react'
import delaveagaImg from '../../assets/hero-delaveaga-5.png'
import seabrightImg from '../../assets/seabright.png'
import closeupImg from '../../assets/closeup.jpeg'
import noplaqueImg from '../../assets/noplaque.png'
import rightsideImg from '../../assets/rightsideshot.png'
import './Gallery.css'

const SLIDE_INTERVAL_MS = 5000

const GALLERY_SLIDES = [
  { id: 'delaveaga', src: delaveagaImg, label: 'DeLaveaga Golf Course — Hole 5' },
  { id: 'seabright', src: seabrightImg, label: 'Seabright Country Club' },
  { id: 'closeup', src: closeupImg, label: 'Every contour, captured' },
  { id: 'noplaque', src: noplaqueImg, label: 'The green, in relief' },
  { id: 'rightside', src: rightsideImg, label: 'Built to last' },
]

function Gallery() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (isPaused) return

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % GALLERY_SLIDES.length)
    }, SLIDE_INTERVAL_MS)

    return () => window.clearInterval(timer)
  }, [isPaused])

  const goToSlide = (index: number) => {
    setActiveIndex((index + GALLERY_SLIDES.length) % GALLERY_SLIDES.length)
  }

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
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {GALLERY_SLIDES.map((slide) => (
              <div className="gallery__slide" key={slide.id}>
                <img className="gallery__slide-image" src={slide.src} alt={slide.label} />
                <p className="gallery__slide-label">{slide.label}</p>
              </div>
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

          <div className="gallery__dots">
            {GALLERY_SLIDES.map((slide, index) => (
              <button
                type="button"
                key={slide.id}
                aria-label={`Go to slide ${index + 1}`}
                className={
                  index === activeIndex
                    ? 'gallery__dot gallery__dot--active'
                    : 'gallery__dot'
                }
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Gallery
