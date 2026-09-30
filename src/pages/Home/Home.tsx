import Hero from '../../components/Hero/Hero'
import Features from '../../components/Features/Features'
import Gallery from '../../components/Gallery/Gallery'
import Cta from '../../components/Cta/Cta'
import './Home.css'

function Home() {
  return (
    <main className="home">
      <Hero />
      <Features />
      <Gallery />
      <Cta />
    </main>
  )
}

export default Home
