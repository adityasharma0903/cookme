import { useState, useRef } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import {
  ChefHat, User, Mail, Phone, MapPin,
  Globe, ArrowRight, ArrowLeft,
  CheckCircle, Heart,
  Sparkles, Trophy, TrendingUp
} from 'lucide-react';
import './Collaborator.css';

// ── Steps config ───────────────────────────────────────────────
const STEPS = [
  { id: 1, title: 'Personal Info', icon: <User size={18} />, color: '#C85A70' },
  { id: 2, title: 'Social Presence', icon: <Globe size={18} />, color: '#E97A8F' },
];


const PERKS = [
  { icon: <Trophy size={22} />, title: 'Brand Sponsorships', desc: 'Get connected with food brands' },
  { icon: <TrendingUp size={22} />, title: 'Grow Your Audience', desc: 'Reach 500K+ food lovers' },
  { icon: <Sparkles size={22} />, title: 'Free Collaboration', desc: 'Join our platform for free and start your journey today' },
  { icon: <Globe size={22} />, title: 'Omnichannel Reach', desc: 'YouTube Reels, Instagram, and Website features in one package' },
];

const initialForm = {
  // Step 1
  fullName: '', email: '', phone: '', city: '', country: '',
  // Step 2
  instagram: '', youtube: '', twitter: '', website: '', followers: '',
};

export default function Collaborator() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLDivElement>(null);

  const set = (field: string, value: any) =>
    setForm(f => ({ ...f, [field]: value }));


  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (step === 1) {
      if (!form.fullName.trim()) e.fullName = 'Full name is required';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required';
      if (!form.phone.trim()) e.phone = 'Phone number is required';
      if (!form.city.trim()) e.city = 'City is required';
    }
    if (step === 2) {
      if (!form.instagram.trim() && !form.youtube.trim())
        e.instagram = 'At least one social profile is required';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (!validate()) return;
    setStep(s => Math.min(s + 1, 2));
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const prev = () => {
    setStep(s => Math.max(s - 1, 1));
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 1800));
    setIsSubmitting(false);
    setSubmitted(true);
  };

  // ── Submitted Screen ──────────────────────────────────────────
  if (submitted) {
    return (
      <div className="collab-page">
        <FloatingBlobs />
        <motion.div
          className="collab-success"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 20 }}
        >
          <motion.div
            className="collab-success__icon"
            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
          >
            <CheckCircle size={64} />
          </motion.div>
          <h2>You're on the List! 🎉</h2>
          <p>
            Thanks <strong>{form.fullName}</strong>! We've received your collaboration
            request. Our team will review it and reach out to <strong>{form.email}</strong>
            {' '}within <strong>3–5 business days</strong>.
          </p>
          <div className="collab-success__perks">
            {PERKS.map((p, i) => (
              <motion.div
                key={i}
                className="collab-success__perk"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
              >
                <span className="collab-success__perk-icon">{p.icon}</span>
                <div>
                  <strong>{p.title}</strong>
                  <span>{p.desc}</span>
                </div>
              </motion.div>
            ))}
          </div>
          <motion.a
            href="/"
            className="collab-success__btn"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            Back to Home <ArrowRight size={16} />
          </motion.a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="collab-page">
      <FloatingBlobs />

      {/* ── HERO ───────────────────────────────────────────── */}
      <section className="collab-hero">
        <div className="collab-hero__inner container">
          <motion.div
            className="collab-hero__badge"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Sparkles size={14} /> Now Accepting Applications
          </motion.div>
          <motion.h1
            className="collab-hero__title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Become a <span className="collab-hero__accent">Recipe Creator</span>
            <br />Zaika <span className="collab-hero__dot">Recipes</span>
          </motion.h1>
          <motion.p
            className="collab-hero__desc"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Join our growing community of passionate chefs and food creators.
            Share your recipes, build your audience, and unlock brand sponsorships.
          </motion.p>


        </div>
      </section>

      {/* ── PERKS STRIP ────────────────────────────────────── */}
      <section className="collab-perks">
        <div className="container">
          <div className="collab-perks__grid">
            {PERKS.map((p, i) => (
              <motion.div
                key={i}
                className="collab-perk-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6, boxShadow: '0 16px 40px rgba(200,90,112,0.15)' }}
              >
                <div className="collab-perk-card__icon">{p.icon}</div>
                <strong>{p.title}</strong>
                <span>{p.desc}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MULTI-STEP FORM ────────────────────────────────── */}
      <section className="collab-form-section" ref={formRef}>
        <div className="container">
          <div className="collab-form-wrap">

            {/* Left Panel */}
            <div className="collab-form-left">
              <div className="collab-form-left__inner">
                <ChefHat size={40} className="collab-form-left__logo" />
                <h3>Your Application</h3>
                <p>Fill out all 2 steps to submit your collaboration request.</p>

                {/* Steps list */}
                <div className="collab-steps-list">
                  {STEPS.map(s => (
                    <motion.div
                      key={s.id}
                      className={`collab-step-item ${step === s.id ? 'active' : ''} ${step > s.id ? 'done' : ''}`}
                      onClick={() => step > s.id && setStep(s.id)}
                      whileHover={step > s.id ? { x: 4 } : {}}
                    >
                      <div className="collab-step-item__num" style={{ '--step-color': s.color } as any}>
                        {step > s.id ? <CheckCircle size={16} /> : s.id}
                      </div>
                      <div className="collab-step-item__label">
                        <div className="collab-step-item__icon">{s.icon}</div>
                        {s.title}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Quote */}
                <div className="collab-form-left__quote">
                  <Heart size={16} />
                  <span>"Every great dish starts with passion."</span>
                </div>
              </div>
            </div>

            {/* Right – Form */}
            <div className="collab-form-right">
              {/* Progress bar */}
              <div className="collab-progress-bar">
                <motion.div
                  className="collab-progress-bar__fill"
                  animate={{ width: `${(step / 2) * 100}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>
              <div className="collab-progress-label">
                Step {step} of 2 — {STEPS[step - 1].title}
              </div>

              <AnimatePresence mode="wait">
                {step === 1 && (
                  <StepPersonal key="s1" form={form} set={set} errors={errors} />
                )}
                {step === 2 && (
                  <StepSocial key="s2" form={form} set={set} errors={errors} />
                )}
              </AnimatePresence>

              {/* Navigation */}
              <div className="collab-nav">
                {step > 1 && (
                  <motion.button
                    className="collab-nav__prev"
                    onClick={prev}
                    whileHover={{ x: -3 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <ArrowLeft size={18} /> Back
                  </motion.button>
                )}
                <motion.button
                  className="collab-nav__next"
                  onClick={step < 2 ? next : handleSubmit}
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.03, boxShadow: '0 8px 30px rgba(200,90,112,0.4)' }}
                  whileTap={{ scale: 0.97 }}
                >
                  {isSubmitting ? (
                    <span className="collab-spinner" />
                  ) : step < 2 ? (
                    <> Next <ArrowRight size={18} /> </>
                  ) : (
                    <> Submit Application <CheckCircle size={18} /> </>
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ── SUB-COMPONENTS ─────────────────────────────────────────────

const stepVariants: Variants = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as any } },
  exit: { opacity: 0, x: -40, transition: { duration: 0.25 } },
};

function FloatingBlobs() {
  return (
    <div className="collab-blobs" aria-hidden="true">
      <div className="collab-blob collab-blob--1" />
      <div className="collab-blob collab-blob--2" />
      <div className="collab-blob collab-blob--3" />
    </div>
  );
}

function FieldWrap({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className={`collab-field ${error ? 'collab-field--error' : ''}`}>
      <label className="collab-field__label">{label}</label>
      {children}
      {error && <span className="collab-field__error">{error}</span>}
    </div>
  );
}

function Input({ icon, ...props }: any) {
  return (
    <div className="collab-input-wrap">
      {icon && <span className="collab-input-icon">{icon}</span>}
      <input className="collab-input" {...props} />
    </div>
  );
}

// Step 1 ─────────────────────────────────────────────────────
function StepPersonal({ form, set, errors }: any) {
  return (
    <motion.div className="collab-step" variants={stepVariants} initial="initial" animate="animate" exit="exit">
      <div className="collab-step__header">
        <User size={28} className="collab-step__icon" />
        <div>
          <h3>Tell us about yourself</h3>
          <p>Basic information to get started</p>
        </div>
      </div>
      <div className="collab-fields">
        <FieldWrap label="Full Name *" error={errors.fullName}>
          <Input icon={<User size={16} />} type="text" placeholder="Aditya Sharma" value={form.fullName} onChange={(e: any) => set('fullName', e.target.value)} />
        </FieldWrap>
        <FieldWrap label="Email Address *" error={errors.email}>
          <Input icon={<Mail size={16} />} type="email" placeholder="you@example.com" value={form.email} onChange={(e: any) => set('email', e.target.value)} />
        </FieldWrap>
        <FieldWrap label="Phone Number *" error={errors.phone}>
          <Input icon={<Phone size={16} />} type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={(e: any) => set('phone', e.target.value)} />
        </FieldWrap>
        <div className="collab-fields--row">
          <FieldWrap label="City *" error={errors.city}>
            <Input icon={<MapPin size={16} />} type="text" placeholder="Mumbai" value={form.city} onChange={(e: any) => set('city', e.target.value)} />
          </FieldWrap>
          <FieldWrap label="Country">
            <Input icon={<Globe size={16} />} type="text" placeholder="India" value={form.country} onChange={(e: any) => set('country', e.target.value)} />
          </FieldWrap>
        </div>
      </div>
    </motion.div>
  );
}

// Step 2 ─────────────────────────────────────────────────────
function StepSocial({ form, set, errors }: any) {
  return (
    <motion.div className="collab-step" variants={stepVariants} initial="initial" animate="animate" exit="exit">
      <div className="collab-step__header">
        <Globe size={28} className="collab-step__icon" />
        <div>
          <h3>Your Social Presence</h3>
          <p>Share your existing platforms and reach</p>
        </div>
      </div>
      <div className="collab-fields">
        <FieldWrap label="Instagram Handle" error={errors.instagram}>
          <div className="collab-input-wrap">
            <span className="collab-input-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
            </span>
            <input className="collab-input" type="text" placeholder="@your_handle" value={form.instagram} onChange={(e: any) => set('instagram', e.target.value)} />
          </div>
        </FieldWrap>
        <FieldWrap label="YouTube Channel">
          <div className="collab-input-wrap">
            <span className="collab-input-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-2.47 4.83 4.83 0 0 1-3.78 2.47H10.5s-6.5 0-6.5 6.5v.62c0 3.59 2.91 6.5 6.5 6.5h3s6.5 0 6.5-6.5v-.62a4.83 4.83 0 0 1-1.41-.5zM10 15V9l5 3-5 3z" /></svg>
            </span>
            <input className="collab-input" type="text" placeholder="youtube.com/c/yourchannel" value={form.youtube} onChange={(e: any) => set('youtube', e.target.value)} />
          </div>
        </FieldWrap>
        <FieldWrap label="Twitter / X Handle">
          <div className="collab-input-wrap">
            <span className="collab-input-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
            </span>
            <input className="collab-input" type="text" placeholder="@handle" value={form.twitter} onChange={(e: any) => set('twitter', e.target.value)} />
          </div>
        </FieldWrap>
        <FieldWrap label="Website / Portfolio">
          <Input icon={<Globe size={16} />} type="url" placeholder="https://yourwebsite.com" value={form.website} onChange={(e: any) => set('website', e.target.value)} />
        </FieldWrap>
        <FieldWrap label="Total Followers (approx)">
          <div className="collab-select-wrap">
            <select className="collab-select" value={form.followers} onChange={(e: any) => set('followers', e.target.value)}>
              <option value="">Select range</option>
              <option value="0-1k">0 – 1,000</option>
              <option value="1k-10k">1K – 10K</option>
              <option value="10k-50k">10K – 50K</option>
              <option value="50k-100k">50K – 100K</option>
              <option value="100k+">100K+</option>
              <option value="new">Just Starting Out</option>
            </select>
          </div>
        </FieldWrap>

        {/* Terms */}
        <div className={`collab-terms ${errors.agreeTerms ? 'error' : ''}`}>
          <label className="collab-terms__label">
            <input
              type="checkbox"
              checked={form.agreeTerms}
              onChange={e => set('agreeTerms', e.target.checked)}
            />
            <span className="collab-terms__box" />
            <span>
              I agree to the <a href="/terms" target="_blank">Terms & Conditions</a> and{' '}
              <a href="/privacy" target="_blank">Privacy Policy</a>. I confirm all
              information provided is accurate.
            </span>
          </label>
          {errors.agreeTerms && <span className="collab-field__error">{errors.agreeTerms}</span>}
        </div>
      </div>
    </motion.div>
  );
}
