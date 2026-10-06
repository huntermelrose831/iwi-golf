import { useState } from 'react'
import type { FormEvent } from 'react'
import { sendContactMessage } from '../../lib/api'
import './Contact.css'

function Contact() {
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('idle')

    if (!email.trim() && !phone.trim()) {
      setStatus('error')
      setErrorMessage('Please provide an email or phone number so we can get back to you.')
      return
    }

    setIsSubmitting(true)

    try {
      await sendContactMessage({ email, phone, message })
      setStatus('success')
      setEmail('')
      setPhone('')
      setMessage('')
    } catch (error) {
      setStatus('error')
      setErrorMessage(
        error instanceof Error ? error.message : 'Something went wrong sending your message. Please try again.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="contact">
      <div className="contact__inner">
        <h2 className="contact__heading">Contact us</h2>
        <p className="contact__subtext">
          Questions about your order, or anything else? Send us a message.
        </p>

        <form className="contact__form" onSubmit={handleSubmit}>
          <div className="contact__row">
            <label className="contact__field">
              <span className="contact__label">Email</span>
              <input
                type="email"
                className="contact__input"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.currentTarget.value)}
                maxLength={200}
              />
            </label>

            <label className="contact__field">
              <span className="contact__label">Phone</span>
              <input
                type="tel"
                className="contact__input"
                placeholder="(555) 555-5555"
                value={phone}
                onChange={(event) => setPhone(event.currentTarget.value)}
                maxLength={40}
              />
            </label>
          </div>

          <label className="contact__field">
            <span className="contact__label">Message</span>
            <textarea
              className="contact__textarea"
              placeholder="How can we help?"
              value={message}
              onChange={(event) => setMessage(event.currentTarget.value)}
              maxLength={2000}
              rows={5}
              required
            />
          </label>

          {status === 'success' && (
            <p className="contact__success">Thanks! We'll get back to you soon.</p>
          )}
          {status === 'error' && (
            <p className="contact__error">
              Something went wrong sending your message. Please try again.
            </p>
          )}

          <button type="submit" className="contact__submit" disabled={isSubmitting}>
            {isSubmitting ? 'Sending…' : 'Send message'}
          </button>
        </form>
      </div>
    </section>
  )
}

export default Contact
