import './Features.css'

const FEATURE_ITEMS = [
  {
    title: 'The Green, in relief',
    description:
      "Printed from the Green's real contours, showing the green in layered relief. Go ahead, trace the path your ball rode into the hole.",
  },
  {
    title: 'Everything Nearby',
    description:
      'The surrounding ruffled fringe, the sand and water and more. All the trouble your shot avoided.',
  },
  {
    title: 'Your shot, on record',
    description:
      'The data of your shot – the hole, the yardage, the pin location, your club selection. The story of you ace travels with the model.',
  },
]

function Features() {
  return (
    <section className="features" id="how-its-made">
      <div className="features__inner">
        <h2 className="features__heading">Exactly the hole you aced</h2>
        <div className="features__grid">
          {FEATURE_ITEMS.map((item) => (
            <article className="features__item" key={item.title}>
              <h3 className="features__item-title">{item.title}</h3>
              <p className="features__item-description">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
