import './Features.css'

const FEATURE_ITEMS = [
  {
    title: 'The green, in relief',
    description:
      "Printed from the hole's real contours, the green rises in layered relief — you can trace the slope your ball rode toward the cup.",
  },
  {
    title: 'Everything nearby',
    description:
      'The surrounding fairway and rough, the sand traps — rakes included — and any water guarding the green. All the trouble your shot ignored.',
  },
  {
    title: 'Your shot, on record',
    description:
      'Course, hole, golfer — and if you tell us, the date, the yardage, and the club. The story of the ace travels with the model.',
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
