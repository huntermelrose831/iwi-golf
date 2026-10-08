import Button from '../Button/Button'
import celebration from '../../assets/Celebration.png'
import './Hero.css'

function Hero() {
  return (
    <section className="hero">
      <div className="hero__inner">
        <div className="hero__copy">
          <h1 className="hero__heading">
            One swing.
            <br />
            One bounce.
            <br />
            Rolling......
            <br />
            <span className="hero__heading-accent">It Went In!™</span>
          </h1>
          <p className="hero__subtext">
            Your Hole-in-One. Golf’s most exciting moment!
Celebrate yours with a 3D printed model – The green with its contours, the surrounding
fringe with it’s bunkers, water, boulders, and the other dangers you avoided
          </p>
          <div className="hero__actions">
            <Button to="/order" variant="primary">
              Order Yours
            </Button>
            <Button href="#how-its-made" variant="secondary">
              See how it's made
            </Button>
          </div>
        </div>
        <div className="hero__visual">
          <img className="hero__image" src={celebration} alt="3D printed model of a hole-in-one" />
        </div>
      </div>
    </section>
  )
}

export default Hero
