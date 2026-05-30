import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, Sparkles } from 'lucide-react';
import API from '../../api';
import './Contact.css';

const contactMethods = [
  {
    icon: <Mail size={18} />,
    title: 'Email Us',
    subtitle: 'supportzaikarecipes@gmail.com',
    href: 'mailto:supportzaikarecipes@gmail.com?subject=Contact%20Zaika%20Recipes',
  },
];

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim() || !email.trim() || !mobile.trim() || !message.trim()) {
      setError('Name, email, mobile number, and message are required.');
      return;
    }

    try {
      setIsSending(true);

      // First, submit to FormSubmit from the browser so emails are delivered by FormSubmit
      const formSubmitUrl = `https://formsubmit.co/ajax/${encodeURIComponent('supportzaikarecipes@gmail.com')}`;
      const params = new URLSearchParams();
      params.append('name', name.trim());
      params.append('email', email.trim());
      params.append('_replyto', email.trim());
      params.append('mobile', mobile.trim());
      params.append('_subject', subject.trim() || 'New contact message from Zaika Recipes');
      params.append('message', message.trim());
      params.append('_captcha', 'false');
      params.append('_template', 'table');

      let mailSent = false;
      let mailResponse: any = {};
      try {
        const resp = await fetch(formSubmitUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
          body: params.toString(),
        });
        const json = await resp.json().catch(() => null);
        mailSent = resp.ok && !(json && json.success === 'false');
        mailResponse = { status: resp.status, ok: resp.ok, body: json };
      } catch (err: any) {
        mailSent = false;
        mailResponse = { error: err?.message || String(err) };
      }

      // Then save to our backend, telling it we already forwarded to FormSubmit
      const { data } = await API.post('/contact', {
        name,
        email,
        mobile,
        subject,
        message,
        skipFormSubmit: true,
        formsubmitStatus: mailSent ? 'sent' : 'failed',
        formsubmitResponse: mailResponse,
      });

      setSuccess(mailSent 
        ? 'Your message was sent and saved successfully.' 
        : 'Your message was saved.'
      );
      setName('');
      setEmail('');
      setMobile('');
      setSubject('');
      setMessage('');
    } catch (submitError: any) {
      setError(submitError?.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="contact-page">
      <section className="contact-hero">
        <div className="contact-hero__bg" />
        <div className="container contact-hero__inner">
          <div className="contact-hero__content">
            <span className="contact-hero__tag">GET IN TOUCH</span>
            <h1 className="contact-hero__title">
              Love Recipes? <span>Talk to me!</span>
            </h1>
            <p className="contact-hero__desc">
              Whether you have a question about a recipe, want to share your results, or just want to say hi,
              I’m always listening.
            </p>

            <div className="contact-hero__cards">
              {contactMethods.map((item) => (
                <motion.a
                  key={item.title}
                  className="contact-card contact-card--thin"
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="contact-card__icon">{item.icon}</div>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.subtitle}</p>
                  </div>
                </motion.a>
              ))}
            </div>

            <div className="contact-hero__info-boxes">
              <div className="contact-info-box">
                <h4>Support Hours</h4>
                <p>Monday - Saturday, 9 AM - 7 PM</p>
              </div>
              <div className="contact-info-box">
                <h4>Response Time</h4>
                <p>Typically under 24 hours</p>
              </div>
            </div>
          </div>

          <motion.div
            className="contact-form"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="contact-form__header">
              <span className="contact-form__subtitle">Send a message</span>
              <h2>Contact Us</h2>
            </div>

            <form className="contact-form__fields" onSubmit={handleSubmit}>
              <label>
                Your Name *
                <input type="text" placeholder="Enter your name" value={name} onChange={e => setName(e.target.value)} />
              </label>
              <label>
                Email Address *
                <input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} />
              </label>
              <label>
                Mobile Number *
                <input type="tel" placeholder="Enter your mobile number" value={mobile} onChange={e => setMobile(e.target.value)} />
              </label>
              <label>
                Subject
                <input type="text" placeholder="What is this about?" value={subject} onChange={e => setSubject(e.target.value)} />
              </label>
              <label className="contact-form__message">
                Your Message *
                <textarea rows={6} placeholder="Write your message..." value={message} onChange={e => setMessage(e.target.value)} />
              </label>

              {error && <div className="contact-form__status contact-form__status--error">{error}</div>}
              {success && <div className="contact-form__status contact-form__status--success">{success}</div>}

              <button className="contact-form__submit" type="submit" disabled={isSending}>
                {isSending ? 'Sending...' : 'Send'} <Send size={16} />
              </button>
            </form>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default Contact;
