import { Routes, Route } from 'react-router-dom'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import ScrollToTop from './components/ScrollToTop/ScrollToTop'
import Home from './pages/Home/Home'
import Order from './pages/Order/Order'
import OrderSuccess from './pages/OrderSuccess/OrderSuccess'
import OrderCancel from './pages/OrderCancel/OrderCancel'
import './App.css'

function App() {
  return (
    <div className="app">
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/order" element={<Order />} />
        <Route path="/order/success" element={<OrderSuccess />} />
        <Route path="/order/cancel" element={<OrderCancel />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
