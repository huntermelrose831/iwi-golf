import delaveagaImg from '../../assets/hero-delaveaga-5.png'
import seabrightImg from '../../assets/seabright.png'
import closeupImg from '../../assets/closeup.jpeg'
import './Gallery.css'

const GALLERY_ITEMS = [
  { id: 'delaveaga', src: delaveagaImg, label: 'DeLaveaga Golf Course — Hole 5' },
  { id: 'seabright', src: seabrightImg, label: 'Seabright Country Club' },
  { id: 'closeup', src: closeupImg, label: 'Every contour, captured' },
]

function Gallery() {
  return (
    <section className="gallery">
      <div className="gallery__inner">
        <h2 className="gallery__heading">Aces we've built</h2>
        <div className="gallery__grid">
          {GALLERY_ITEMS.map((item) => (
            <div className="gallery__item" key={item.id}>
              <img className="gallery__item-image" src={item.src} alt={item.label} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Gallery
