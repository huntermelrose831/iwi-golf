import './Footer.css'

const APP_VERSION = '1.0.0'

function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer__inner">
        <p className="footer__copyright">© Copyright {year}, IWI™ Enterprise</p>
        <p className="footer__location">Based in Santa Cruz, CA</p>
        <p className="footer__version">v{APP_VERSION}</p>
      </div>
    </footer>
  )
}

export default Footer
