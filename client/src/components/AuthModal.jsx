import React, { useState } from 'react';
import {
  X,
  Lock,
  Mail,
  User as UserIcon,
  Loader2,
  Sparkles,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { loginUser, registerUser } from '../services/api';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  // Calculate password strength
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: 'None', color: 'transparent' };
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 8) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 2) return { score: 33, label: 'Weak', color: '#f43f5e' };
    if (score <= 4) return { score: 66, label: 'Medium', color: '#f59e0b' };
    return { score: 100, label: 'Strong', color: '#10b981' };
  };

  const strength = isRegister ? getPasswordStrength(password) : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (isRegister) {
      if (password.length < 6) {
        setErrorMsg('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match. Please re-check.');
        return;
      }
    }

    setLoading(true);

    try {
      let data;
      if (isRegister) {
        data = await registerUser({ name, email, password });
      } else {
        data = await loginUser({ email, password });
      }

      if (data.token && data.user) {
        localStorage.setItem('ecom_auth_token', data.token);
        localStorage.setItem('ecom_user_info', JSON.stringify(data.user));
        onAuthSuccess(data.user, isRegister ? 'register' : 'login');
        onClose();
      } else {
        setErrorMsg(data.message || 'Authentication error.');
      }
    } catch (err) {
      const serverMsg = err.response?.data?.message || 'Authentication failed. Please try again.';
      setErrorMsg(serverMsg);
    } finally {
      setLoading(false);
    }
  };

  // Quick Demo Login Helper
  const handleQuickDemo = async () => {
    setErrorMsg('');
    setLoading(true);
    try {
      const demoEmail = 'shopper@omnibrand.ai';
      const demoPassword = 'password123';
      let data;
      try {
        data = await loginUser({ email: demoEmail, password: demoPassword });
      } catch {
        // If demo user doesn't exist, create it
        data = await registerUser({ name: 'Alex Hunter', email: demoEmail, password: demoPassword });
      }

      if (data.token && data.user) {
        localStorage.setItem('ecom_auth_token', data.token);
        localStorage.setItem('ecom_user_info', JSON.stringify(data.user));
        onAuthSuccess(data.user, 'login');
        onClose();
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Demo sign-in failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(16px)',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.25rem'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '460px',
        width: '100%',
        padding: '2.25rem',
        background: 'rgba(13, 18, 31, 0.95)',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 40px rgba(99, 102, 241, 0.25)',
        position: 'relative'
      }}>
        {/* Ambient Top Glow */}
        <div style={{
          position: 'absolute',
          top: '-40px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '200px',
          height: '100px',
          background: 'var(--accent-primary)',
          filter: 'blur(70px)',
          opacity: 0.3,
          pointerEvents: 'none'
        }} />

        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.15rem',
            right: '1.15rem',
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'var(--text-muted)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.45rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s'
          }}
          title="Close dialog"
        >
          <X size={18} />
        </button>

        {/* Tab Switcher */}
        <div style={{
          display: 'flex',
          background: 'rgba(0, 0, 0, 0.4)',
          padding: '4px',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <button
            type="button"
            onClick={() => { setIsRegister(false); setErrorMsg(''); }}
            style={{
              flex: 1,
              padding: '0.55rem',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: !isRegister ? 'var(--gradient-btn)' : 'transparent',
              color: !isRegister ? '#fff' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: !isRegister ? '0 0 14px rgba(99, 102, 241, 0.4)' : 'none'
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsRegister(true); setErrorMsg(''); }}
            style={{
              flex: 1,
              padding: '0.55rem',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: isRegister ? 'var(--gradient-btn)' : 'transparent',
              color: isRegister ? '#fff' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: isRegister ? '0 0 14px rgba(99, 102, 241, 0.4)' : 'none'
            }}
          >
            Create Account
          </button>
        </div>

        {/* Form Title */}
        <div style={{ marginBottom: '1.25rem', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.45rem', fontWeight: 800, margin: '0 0 0.35rem 0', letterSpacing: '-0.02em' }}>
            {isRegister ? 'Join OmniPrice 🚀' : 'Welcome Back 👋'}
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
            {isRegister
              ? 'Create your free account to track price drops & sync saved items across devices.'
              : 'Sign in to access your saved wishlist, price alerts, and personalized ML deals.'}
          </p>
        </div>

        {/* Error Notification Pill */}
        {errorMsg && (
          <div style={{
            padding: '0.75rem 1rem',
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.35)',
            borderRadius: 'var(--radius-md)',
            color: '#fb7185',
            fontSize: '0.82rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem'
          }}>
            <AlertCircle size={16} color="#fb7185" style={{ flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {isRegister && (
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <UserIcon size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Hunter"
                  style={{
                    width: '100%',
                    padding: '0.7rem 0.85rem 0.7rem 2.6rem',
                    background: 'rgba(0, 0, 0, 0.35)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    color: '#fff',
                    fontFamily: 'inherit',
                    fontSize: '0.9rem'
                  }}
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                style={{
                  width: '100%',
                  padding: '0.7rem 0.85rem 0.7rem 2.6rem',
                  background: 'rgba(0, 0, 0, 0.35)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  color: '#fff',
                  fontFamily: 'inherit',
                  fontSize: '0.9rem'
                }}
              />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Password
              </label>
              {isRegister && strength && password && (
                <span style={{ fontSize: '0.72rem', color: strength.color, fontWeight: 700 }}>
                  Strength: {strength.label}
                </span>
              )}
            </div>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isRegister ? 'Min. 6 characters' : 'Enter your password'}
                style={{
                  width: '100%',
                  padding: '0.7rem 2.6rem 0.7rem 2.6rem',
                  background: 'rgba(0, 0, 0, 0.35)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  color: '#fff',
                  fontFamily: 'inherit',
                  fontSize: '0.9rem'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-dim)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>

            {/* Password strength meter */}
            {isRegister && password && (
              <div style={{
                width: '100%',
                height: '4px',
                background: 'rgba(255, 255, 255, 0.08)',
                borderRadius: 'var(--radius-full)',
                marginTop: '0.5rem',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${strength.score}%`,
                  height: '100%',
                  background: strength.color,
                  transition: 'width 0.3s ease, background 0.3s ease'
                }} />
              </div>
            )}
          </div>

          {/* Confirm Password field for Registration */}
          {isRegister && (
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>
                Confirm Password
              </label>
              <div style={{ position: 'relative' }}>
                <ShieldCheck size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type password"
                  style={{
                    width: '100%',
                    padding: '0.7rem 0.85rem 0.7rem 2.6rem',
                    background: 'rgba(0, 0, 0, 0.35)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    color: '#fff',
                    fontFamily: 'inherit',
                    fontSize: '0.9rem'
                  }}
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{
              width: '100%',
              justifyContent: 'center',
              marginTop: '0.65rem',
              padding: '0.85rem',
              fontSize: '0.95rem'
            }}
          >
            {loading ? (
              <Loader2 size={19} className="animate-spin" />
            ) : (
              <>
                <Sparkles size={18} />
                <span>{isRegister ? 'Create Account' : 'Sign In'}</span>
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.85rem',
          margin: '1.25rem 0 0.85rem 0',
          color: 'var(--text-dim)',
          fontSize: '0.75rem'
        }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.08)' }} />
          <span>OR</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.08)' }} />
        </div>

        {/* Quick Demo Access Button */}
        <button
          type="button"
          onClick={handleQuickDemo}
          disabled={loading}
          className="btn-secondary"
          style={{
            width: '100%',
            justifyContent: 'center',
            padding: '0.65rem',
            fontSize: '0.82rem',
            borderColor: 'rgba(99, 102, 241, 0.3)',
            background: 'rgba(99, 102, 241, 0.08)',
            color: '#c7d2fe'
          }}
        >
          <Zap size={15} color="#818cf8" />
          <span>One-Click Demo Sign-In</span>
        </button>

        {/* Security badge note */}
        <p style={{
          fontSize: '0.7rem',
          color: 'var(--text-dim)',
          textAlign: 'center',
          marginTop: '1.25rem',
          marginBottom: 0
        }}>
          🔒 Secured with bcrypt encryption & MongoDB Atlas authentication.
        </p>
      </div>
    </div>
  );
}
