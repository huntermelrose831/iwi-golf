import Button from '../Button/Button'
import './Cta.css'

function Cta() {
  return (
    <section className="cta">
      <div className="cta__inner">
        <h2 className="cta__heading">
          You made the shot.
          <br />
          We'll make the model.
        </h2>
        <p className="cta__subtext">Tell us the course, the hole, and who hit it.</p>
        <Button to="/order" variant="primary">
          Order Yours
        </Button>
      </div>
    </section>
  )
}

export default Cta
