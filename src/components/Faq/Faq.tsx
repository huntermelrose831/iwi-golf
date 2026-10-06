import { useState } from 'react'
import './Faq.css'

const FAQ_ITEMS = [
  {
    question: 'What material is the model printed in, and is it okay outdoors?',
    answer:
      "Models are 3D printed in PLA, a durable plastic that looks great on a shelf, desk, or mantel. This is an indoor-use item only — don't put it outside, as PLA can soften and warp when exposed to direct sunlight or heat.",
  },
  {
    question: 'Is the fringe and surrounding area printed exactly to scale?',
    answer:
      "The green, bunkers, water, and fringe are modeled from the real contours of the hole, but some proportions are adjusted so everything fits cleanly on the plaque. It won't be a millimeter-exact scale replica, but it captures the hole and the shot in a way you'll recognize immediately.",
  },
  {
    question: "What if there's a problem with my order?",
    answer:
      "If your model doesn't arrive, shows up damaged, has a broken rake, the pin is in the wrong spot, or there's an error on the plaque, reach out through the contact form below with your order details and we'll make it right.",
  },
]

function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleItem = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index))
  }

  return (
    <section className="faq">
      <div className="faq__inner">
        <h2 className="faq__heading">Frequently asked questions</h2>
        <div className="faq__list">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index

            return (
              <div className="faq__item" key={item.question}>
                <button
                  type="button"
                  className="faq__question"
                  onClick={() => toggleItem(index)}
                  aria-expanded={isOpen}
                >
                  <span>{item.question}</span>
                  <span className="faq__question-icon">{isOpen ? '−' : '+'}</span>
                </button>
                {isOpen && <p className="faq__answer">{item.answer}</p>}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Faq
