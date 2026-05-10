import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, ChefHat, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './AuthModal.css';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'signup';
  message?: string;
}

// Reusable Google SVG logo
const GoogleLogo = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    <path fill="none" d="M0 0h48v48H0z"/>
  </svg>
);

const GOOGLE_URL = `${(import.meta as any).env?.VITE_API_URL || 'http://localhost:5000'}/api/auth/google`;

const AuthModal = ({ isOpen, onClose, defaultTab = 'login', message }: AuthModalProps) => {
  const [tab, setTab] = useState<'login' | 'signup'>(defaultTab);
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');

  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPass, setSignupPass] = useState('');
  const [signupConfirm, setSignupConfirm] = useState('');

  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!loginEmail || !loginPass) { setError('Please fill all fields.'); return; }
    setIsSubmitting(true);
    const result = await login(loginEmail, loginPass);
    setIsSubmitting(false);
    if (result.success) {
      onClose();
      navigate('/dashboard');
    } else {
      setError(result.error || 'Login failed.');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!signupName || !signupEmail || !signupPass) { setError('Please fill all fields.'); return; }
    if (signupPass.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (signupPass !== signupConfirm) { setError('Passwords do not match.'); return; }
    setIsSubmitting(true);
    const result = await signup(signupName, signupEmail, signupPass);
    setIsSubmitting(false);
    if (result.success) {
      onClose();
    } else {
      setError(result.error || 'Registration failed.');
    }
  };

  const handleGoogle = () => {
    window.location.href = GOOGLE_URL;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="auth-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="auth-modal"
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button className="auth-modal__close" onClick={onClose}><X size={20} /></button>

          <div className="auth-modal__header">
            <div className="auth-modal__logo"><ChefHat size={28} /></div>
            <h2>Zaika Recipes</h2>
            {message && <p className="auth-modal__message">{message}</p>}
          </div>

          {/* Tabs */}
          <div className="auth-modal__tabs">
            <button className={`auth-modal__tab ${tab === 'login' ? 'active' : ''}`} onClick={() => { setTab('login'); setError(''); }}>Login</button>
            <button className={`auth-modal__tab ${tab === 'signup' ? 'active' : ''}`} onClick={() => { setTab('signup'); setError(''); }}>Sign Up</button>
          </div>

          {/* Error */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div className="auth-modal__error" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <AlertCircle size={16} /> {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ─── LOGIN TAB ─── */}
          {tab === 'login' ? (
            <motion.div key="login" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}>
              <form className="auth-modal__form" onSubmit={handleLogin}>
                <div className="auth-modal__field">
                  <Mail size={16} />
                  <input type="email" placeholder="Email Address" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} />
                </div>
                <div className="auth-modal__field">
                  <Lock size={16} />
                  <input type={showPass ? 'text' : 'password'} placeholder="Password" value={loginPass} onChange={e => setLoginPass(e.target.value)} />
                  <button type="button" className="auth-modal__eye" onClick={() => setShowPass(!showPass)}>
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <motion.button type="submit" className="auth-modal__submit" disabled={isSubmitting} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  {isSubmitting ? 'Logging in...' : 'Login'}
                </motion.button>
              </form>

              {/* Divider */}
              <div className="auth-modal__divider"><span>or</span></div>

              {/* Google */}
              <motion.button
                type="button"
                className="auth-modal__google"
                onClick={handleGoogle}
                whileHover={{ scale: 1.01, boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}
                whileTap={{ scale: 0.99 }}
              >
                <GoogleLogo />
                <span>Continue with Google</span>
              </motion.button>

              <p className="auth-modal__switch">
                Don't have an account? <button onClick={() => { setTab('signup'); setError(''); }}>Sign Up</button>
              </p>
            </motion.div>

          ) : (
          /* ─── SIGNUP TAB ─── */
            <motion.div key="signup" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>
              <form className="auth-modal__form" onSubmit={handleSignup}>
                <div className="auth-modal__field">
                  <User size={16} />
                  <input type="text" placeholder="Full Name" value={signupName} onChange={e => setSignupName(e.target.value)} />
                </div>
                <div className="auth-modal__field">
                  <Mail size={16} />
                  <input type="email" placeholder="Email Address" value={signupEmail} onChange={e => setSignupEmail(e.target.value)} />
                </div>
                <div className="auth-modal__field">
                  <Lock size={16} />
                  <input type={showPass ? 'text' : 'password'} placeholder="Password (min 6 chars)" value={signupPass} onChange={e => setSignupPass(e.target.value)} />
                  <button type="button" className="auth-modal__eye" onClick={() => setShowPass(!showPass)}>
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <div className="auth-modal__field">
                  <Lock size={16} />
                  <input type="password" placeholder="Confirm Password" value={signupConfirm} onChange={e => setSignupConfirm(e.target.value)} />
                </div>
                <motion.button type="submit" className="auth-modal__submit" disabled={isSubmitting} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  {isSubmitting ? 'Creating Account...' : 'Create Account'}
                </motion.button>
              </form>

              {/* Divider */}
              <div className="auth-modal__divider"><span>or</span></div>

              {/* Google */}
              <motion.button
                type="button"
                className="auth-modal__google"
                onClick={handleGoogle}
                whileHover={{ scale: 1.01, boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}
                whileTap={{ scale: 0.99 }}
              >
                <GoogleLogo />
                <span>Continue with Google</span>
              </motion.button>

              <p className="auth-modal__switch">
                Already have an account? <button onClick={() => { setTab('login'); setError(''); }}>Login</button>
              </p>
            </motion.div>
          )}

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AuthModal;
