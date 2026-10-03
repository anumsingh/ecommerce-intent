import React, { useState } from 'react';
import { X, Bell, CheckCircle2, Loader2 } from 'lucide-react';
import { createPriceAlert } from '../services/api';

export default function PriceAlertModal({ product, userEmail, onClose, onAlertSuccess }) {
  const [email, setEmail] = useState(userEmail || '');
  const [targetPrice, setTargetPrice] = useState(
    product ? Math.round((product.price || 1000) * 0.9) : ''
  );
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!product) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !targetPrice) return;

    setLoading(true);
    setErrorMsg('');
    try {
      const res = await createPriceAlert({
        email,
        product_link: product.link,
        product_title: product.title,
        target_price: parseFloat(targetPrice),
        current_price: product.price,
        platform: product.platform
      });
      setSuccessMsg(res.message || 'Price drop alert configured successfully!');
      if (onAlertSuccess) {
        onAlertSuccess(res.message);
      }
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to set price alert');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.82)',
      backdropFilter: 'blur(12px)',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.25rem'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '480px',
        width: '100%',
        padding: '2rem',
        background: 'rgba(13, 18, 31, 0.96)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 35px rgba(245, 158, 11, 0.2)',
        position: 'relative'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'rgba(255, 255, 255, 0.08)',
            border: 'none',
            color: 'var(--text-muted)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.4rem',
            cursor: 'pointer'
          }}
        >
          <X size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <Bell size={22} color="var(--accent-amber)" />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
            Set Price Drop Alert
          </h3>
        </div>

        <p style={{
          fontSize: '0.88rem',
          color: 'var(--text-muted)',
          marginBottom: '1.25rem',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {product.title}
        </p>

        {successMsg ? (
          <div style={{
            padding: '1.25rem',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            borderRadius: 'var(--radius-md)',
            textAlign: 'center',
            color: 'var(--accent-emerald)'
          }}>
            <CheckCircle2 size={32} style={{ margin: '0 auto 0.5rem auto' }} />
            <p style={{ fontWeight: 600, margin: 0 }}>{successMsg}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {errorMsg && (
              <div style={{ padding: '0.75rem', background: 'rgba(244, 63, 94, 0.15)', color: 'var(--accent-rose)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}>
                {errorMsg}
              </div>
            )}

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                Email for Price Drop Notification
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  color: '#fff',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                Target Alert Price (Current: ₹{product.price})
              </label>
              <input
                type="number"
                required
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                placeholder="Target price in INR"
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  color: '#fff',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : 'Notify Me on Price Drop'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
