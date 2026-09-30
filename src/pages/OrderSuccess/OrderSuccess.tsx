import { Link } from 'react-router-dom'
import './OrderSuccess.css'

function OrderSuccess() {
  return (
    <main className="order-success">
      <div className="order-success__inner">
        <h1 className="order-success__heading">Your order is in!</h1>
        <p className="order-success__subtext">
          Thanks for sharing your ace. We'll email you as soon as your model ships.
        </p>
        <Link to="/" className="order-success__link">
          Back to home
        </Link>
      </div>
    </main>
  )
}

export default OrderSuccess
