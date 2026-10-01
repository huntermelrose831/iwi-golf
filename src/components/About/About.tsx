import Button from '../Button/Button'
import './About.css'

function About() {
  return (
    <section className="about">
      <div className="about__inner">
        <h2 className="about__heading">About IWI Enterprises</h2>

        <p className="about__paragraph">
          At IWI Enterprises we believe that a most special event deserves a most special
          celebration. And the most special event in Golf is..... Your Hole-in-One!
        </p>

        <p className="about__paragraph">
          We are focused on providing a 3D Printed Personalized Celebration model for this
          most special moment in golf. The model shows the 3D contours of the Green — and
          includes the pin location and relevant features of the surrounding Fringe. These
          include bunkers, water features, and other elements that define the hole.
          Naturally, there is a spot to place the actual ball!
        </p>

        <p className="about__paragraph">
          Just click the "Order Your Personal Celebration" button and enter the data of
          your Hole-in-One, including course name, hole number, yardage, selected club, and
          date. Your Celebration will be built to order and shipped within five days.
        </p>

        <p className="about__paragraph about__paragraph--emphasis">
          Most golfers never achieve a Hole-in-One. Those who do essentially never get
          another. Don't miss this singular opportunity to celebrate something very special
          with something extra special.
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
