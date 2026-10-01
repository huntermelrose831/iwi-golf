import Button from '../Button/Button'
import './About.css'

function About() {
  return (
    <section className="about">
      <div className="about__inner">
        <h2 className="about__heading">About IWI Enterprises</h2>

        <p className="about__paragraph">
          At IWI Enterprises, we believe the greatest moments in golf deserve a celebration
          to match. And nothing is greater than your hole-in-one.
        </p>

        <p className="about__paragraph">
          We make a 3D printed, personalized model of the actual green where it happened:
          contours, pin location, and the surrounding features that define the hole,
          including bunkers, water, and fringe. And of course, a spot for the ball itself.
        </p>

        <p className="about__paragraph">
          Click "Order Your Personal Celebration," enter the details of your shot
          (course name, hole number, yardage, club, and date), and your model will be
          built to order and shipped within five days.
        </p>

        <p className="about__paragraph about__paragraph--emphasis">
          Most golfers never make a hole-in-one. Those who do almost never make another.
          Don't let this once-in-a-lifetime moment pass without commemorating the event.
        </p>

        <div className="about__actions">
          <Button to="/order" variant="primary">
            Order Your Personal Celebration
          </Button>
        </div>
      </div>
    </section>
  )
}

export default About
