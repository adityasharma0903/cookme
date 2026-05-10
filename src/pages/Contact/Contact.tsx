import { motion } from 'framer-motion';
import { Mail, Send, Sparkles } from 'lucide-react';
import './Contact.css';

const contactMethods = [
  {
    icon: <Mail size={18} />,
    title: 'Email Us',
    subtitle: 'hello@cookwithkaju.com',
    href: 'https://mail.google.com/mail/?view=cm&fs=1&to=hello@cookwithkaju.com&su=Contact%20Zaika%20Recipes&body=Hello%20Zaika%20Recipes',
  },
];

const Contact = () => {
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

            <div className="contact-form__fields">
              <label>
                Your Name
                <input type="text" placeholder="Enter your name" />
              </label>
              <label>
                Email Address
                <input type="email" placeholder="Enter your email" />
              </label>
              <label className="contact-form__message">
                Your Message
                <textarea rows={6} placeholder="Write your message..." />
              </label>
            </div>

            <a
              className="contact-form__submit"
              href="https://mail.google.com/mail/?view=cm&fs=1&to=hello@cookwithkaju.com&su=Contact%20Zaika%20Recipes&body=Hello%20Zaika%20Recipes"
              target="_blank"
              rel="noreferrer"
            >
              Send <Send size={16} />
            </a>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default Contact;
