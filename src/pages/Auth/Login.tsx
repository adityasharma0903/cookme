import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ChefHat, Eye, EyeOff, ArrowRight, Shield, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const Login = () => {
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [selectedRole, setSelectedRole] = useState<'admin' | 'creator'>('creator');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill all fields.'); return; }
    const result = login(email, password);
    if (result.success) {
      navigate(selectedRole === 'admin' ? '/admin' : '/dashboard');
    } else {
      setError(result.error || 'Login failed.');
    }
  };

  const fillDemo = (role: 'admin' | 'creator') => {
    if (role === 'admin') {
      setEmail('admin@cookme.com');
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

            <div className="auth-demo-section">
              <p className="auth-demo-label">Quick Demo Access:</p>
              <div className="auth-demo-buttons">
                <button className="auth-demo-btn auth-demo-btn--admin" onClick={() => fillDemo('admin')}>
                  <Shield size={14} /> Admin Login
                </button>
                <button className="auth-demo-btn auth-demo-btn--creator" onClick={() => fillDemo('creator')}>
                  <Sparkles size={14} /> Creator Login
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="auth-right">
        <motion.div className="auth-form-wrap" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h1 className="auth-title">Sign In</h1>
          <p className="auth-subtitle">Access your dashboard</p>

          {/* Role Selector */}
          <div className="auth-role-selector">
            <button
              className={`auth-role-btn ${selectedRole === 'admin' ? 'active' : ''}`}
              onClick={() => setSelectedRole('admin')}
            >
              <Shield size={16} /> Admin
            </button>
            <button
              className={`auth-role-btn ${selectedRole === 'creator' ? 'active' : ''}`}
              onClick={() => setSelectedRole('creator')}
            >
              <Sparkles size={16} /> Creator
            </button>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div className="auth-error" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <AlertCircle size={16} /> {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form className="auth-form" onSubmit={handleSubmit}>
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
            <motion.button type="submit" className="auth-submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              {selectedRole === 'admin' ? 'Login as Admin' : 'Login as Creator'} <ArrowRight size={18} />
            </motion.button>
          </form>

          <div className="auth-info-box">
            <p><strong>Admin:</strong> admin@cookme.com / admin123</p>
            <p><strong>Creator:</strong> aditya@cookme.com / creator123</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
