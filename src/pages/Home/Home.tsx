import Hero from '../../components/Hero/Hero'
import Features from '../../components/Features/Features'
import About from '../../components/About/About'
import Gallery from '../../components/Gallery/Gallery'
import Faq from '../../components/Faq/Faq'
import Cta from '../../components/Cta/Cta'
import Contact from '../../components/Contact/Contact'
import './Home.css'

function Home() {
  return (
    <main className="home">
      <Hero />
      <Features />
      <Gallery />
      <About />
      <Faq />
      <Cta />
      <Contact />
    </main>
  )
}

export default Home
