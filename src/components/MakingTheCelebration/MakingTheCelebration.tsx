import './MakingTheCelebration.css'

function MakingTheCelebration() {
  return (
    <section className="making">
      <div className="making__inner">
        <h2 className="making__heading">Making the Celebration</h2>
        <div className="making__content">
          <p>
            Most golf course greens are mapped with survey-grade equipment such as total stations or LiDAR scanners. These tools capture precise elevation at thousands of points across the green, producing highly accurate contour maps. Golfers typically see this data in mobile apps that help them "read the greens".
          </p>
          <p>
            At IWI, we put that same data to a different use. We combine it with fringe and color information and process it with our proprietary software. This generates a precise 3MF model of the green and surrounding area, such as bunkers and water features, which is then printed on a high-speed, multi-color 3D printer. We print the greens in visible contour layers because we believe the stepped terrain makes for a more striking presentation.
          </p>
          <p>
            Every other element, from the flags, rakes, and tees to the frames and plaques, is designed in-house at IWI and 3D printed as well. We're proud to say that every part of the Celebration is made through 3D printing – except, of course, the ball you hit!
          </p>
        </div>
      </div>
    </section>
  )
}

export default MakingTheCelebration
