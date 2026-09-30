import { Link } from 'react-router-dom'
import './OrderCancel.css'

function OrderCancel() {
  return (
    <main className="order-cancel">
      <div className="order-cancel__inner">
        <h1 className="order-cancel__heading">Checkout canceled</h1>
        <p className="order-cancel__subtext">
          No charge was made. You can pick up where you left off whenever you're ready.
        </p>
        <Link to="/order" className="order-cancel__link">
          Return to order form
        </Link>
      </div>
    </main>
  )
}

export default OrderCancel
