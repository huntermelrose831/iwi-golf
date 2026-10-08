import { Link } from 'react-router-dom'
import iwiLogo from '../../assets/iwi-logo.png'
import './Header.css'

function Header() {
  return (
    <header className="header">
      <div className="header__inner">
        <Link to="/" className="header__brand">
          <img className="header__logo" src={iwiLogo} alt="IWI.golf" />
          <span className="header__wordmark">IWI™.golf</span>
        </Link>
        <Link to="/order" className="header__cta">
          Order Yours
        </Link>
      </div>
    </header>
  )
}

export default Header
