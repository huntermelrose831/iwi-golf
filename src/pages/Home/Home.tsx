import Hero from '../../components/Hero/Hero'
import About from '../../components/About/About'
import Gallery from '../../components/Gallery/Gallery'
import MakingTheCelebration from '../../components/MakingTheCelebration/MakingTheCelebration'
import Faq from '../../components/Faq/Faq'
import Contact from '../../components/Contact/Contact'
import './Home.css'

function Home() {
  return (
    <main className="home">
      <Hero />
      <About />
      <Gallery />
      <MakingTheCelebration />
      <Faq />
      <Contact />
    </main>
  )
}

export default Home
