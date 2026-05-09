import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ChefHat, Eye, EyeOff, ArrowRight, Shield, Sparkles, AlertCircle, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const Login = () => {
  const location = useLocation();
  const isRegisterRoute = location.pathname === '/register';

  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [selectedRole, setSelectedRole] = useState<'admin' | 'creator'>('creator');
  const [isSignup, setIsSignup] = useState(isRegisterRoute);
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPass, setSignupPass] = useState('');
  const [signupConfirm, setSignupConfirm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill all fields.'); return; }
    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);
    if (result.success) {
      // always navigate to /dashboard; DashboardRoute will route by role
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
      navigate('/');
    } else {
      setError(result.error || 'Registration failed.');
    }
  };

  const fillDemo = (role: 'admin' | 'creator') => {
    setIsSignup(false);
    if (role === 'admin') {
      setEmail('admin@cookwithkaju.com');
      setPassword('admin123');
      setSelectedRole('admin');
    } else {
      setEmail('aditya@cookme.com');
      setPassword('creator123');
      setSelectedRole('creator');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-left__content">
          <div className="auth-left__shapes">
            <div className="auth-shape auth-shape--1" />
            <div className="auth-shape auth-shape--2" />
          </div>
          <motion.div className="auth-left__info" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
            <div className="auth-left__logo"><ChefHat size={32} /></div>
            <h2>Welcome to<br />COOK<span className="text-accent">.</span>ME</h2>
            <p>The recipe creator marketplace where sponsors publish engaging recipes and grow their audience.</p>
            <div className="auth-left__features">
              <div className="auth-feature">🍳 <span>Create & share recipes</span></div>
              <div className="auth-feature">📊 <span>Track engagement & analytics</span></div>
              <div className="auth-feature">🎬 <span>Post recipe reels</span></div>
              <div className="auth-feature">👥 <span>Grow your followers</span></div>
            </div>

            
          </motion.div>
        </div>
      </div>

      <div className="auth-right">
        <motion.div className="auth-form-wrap" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          

          {!isSignup ? (
            <>
              <h1 className="auth-title">Sign In</h1>
              <p className="auth-subtitle">Access your dashboard</p>

              {/* Note: Role selection is no longer required — login will redirect appropriately */}

              <AnimatePresence>
                {error && (
                  <motion.div className="auth-error" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    <AlertCircle size={16} /> {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <form className="auth-form" onSubmit={handleLogin}>
                <div className="auth-input-group">
                  <Mail size={18} className="auth-input-icon" />
                  <input type="email" placeholder="Email Address" className="auth-input" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div className="auth-input-group">
                  <Lock size={18} className="auth-input-icon" />
                  <input type={showPass ? 'text' : 'password'} placeholder="Password" className="auth-input" value={password} onChange={e => setPassword(e.target.value)} />
                  <button type="button" className="auth-eye" onClick={() => setShowPass(!showPass)}>
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <motion.button type="submit" className="auth-submit" disabled={isSubmitting} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  {isSubmitting ? 'Logging in...' : 'Sign In'} <ArrowRight size={18} />
                </motion.button>
              </form>

              {/* Divider */}
              <div className="auth-divider"><span>or</span></div>

              {/* Google Button */}
              <motion.button
                type="button"
                className="auth-google-btn"
                whileHover={{ scale: 1.01, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                whileTap={{ scale: 0.99 }}
                onClick={() => { window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/google`; }}
              >
                {/* Official Google Logo SVG */}
                <svg width="20" height="20" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                  <path fill="none" d="M0 0h48v48H0z"/>
                </svg>
                <span>Continue with Google</span>
              </motion.button>

              {/* Switch to Signup */}
              <div className="auth-bottom-link">
                <span>Don't have an account?</span>
                <button onClick={() => { setIsSignup(true); setError(''); }} className="auth-switch-btn">Sign Up</button>
              </div>
            </>
          ) : (
            <>
              <h1 className="auth-title">Create Account</h1>
              <p className="auth-subtitle">Join COOK.ME and start exploring</p>

              <AnimatePresence>
                {error && (
                  <motion.div className="auth-error" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    <AlertCircle size={16} /> {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <form className="auth-form" onSubmit={handleSignup}>
                <div className="auth-input-group">
                  <User size={18} className="auth-input-icon" />
                  <input type="text" placeholder="Full Name" className="auth-input" value={signupName} onChange={e => setSignupName(e.target.value)} />
                </div>
                <div className="auth-input-group">
                  <Mail size={18} className="auth-input-icon" />
                  <input type="email" placeholder="Email Address" className="auth-input" value={signupEmail} onChange={e => setSignupEmail(e.target.value)} />
                </div>
                <div className="auth-input-group">
                  <Lock size={18} className="auth-input-icon" />
                  <input type={showPass ? 'text' : 'password'} placeholder="Password (min 6 chars)" className="auth-input" value={signupPass} onChange={e => setSignupPass(e.target.value)} />
                  <button type="button" className="auth-eye" onClick={() => setShowPass(!showPass)}>
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <div className="auth-input-group">
                  <Lock size={18} className="auth-input-icon" />
                  <input type="password" placeholder="Confirm Password" className="auth-input" value={signupConfirm} onChange={e => setSignupConfirm(e.target.value)} />
                </div>
                <motion.button type="submit" className="auth-submit" disabled={isSubmitting} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  {isSubmitting ? 'Creating Account...' : 'Create Account'} <ArrowRight size={18} />
                </motion.button>
              </form>

              {/* Divider */}
              <div className="auth-divider"><span>or</span></div>

              {/* Google Button */}
              <motion.button
                type="button"
                className="auth-google-btn"
                whileHover={{ scale: 1.01, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                whileTap={{ scale: 0.99 }}
                onClick={() => { window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/google`; }}
              >
                <svg width="20" height="20" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                  <path fill="none" d="M0 0h48v48H0z"/>
                </svg>
                <span>Continue with Google</span>
              </motion.button>

              <div className="auth-bottom-link">
                <span>Already have an account?</span>
                <button onClick={() => { setIsSignup(false); setError(''); }} className="auth-switch-btn">Sign In</button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
