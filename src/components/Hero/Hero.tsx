import Button from '../Button/Button'
import heroImg from '../../assets/hero-delaveaga-5.png'
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
            <span className="hero__heading-accent">It Went In!™</span>
          </h1>
          <p className="hero__subtext">
            A hole-in-one happens once, if it happens at all. IWI — It Went In — turns
            yours into a 3D printed model: the green and its slopes, the fringe around
            it, the bunkers and water that didn't catch your ball.
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
          <img className="hero__image" src={heroImg} alt="3D printed model of a hole-in-one" />
        </div>
      </div>
    </section>
  )
}

export default Hero
