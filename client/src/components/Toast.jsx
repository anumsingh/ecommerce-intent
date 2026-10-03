import React, { useEffect } from 'react';
import { CheckCircle2, Sparkles, LogOut, UserCheck, AlertCircle, Heart, Bell, X } from 'lucide-react';

export default function Toast({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '1.75rem',
      right: '1.75rem',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.85rem',
      maxWidth: '420px',
      width: 'calc(100% - 2.5rem)',
      pointerEvents: 'none'
    }}>
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={() => onDismiss(t.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, toast.duration || 4500);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  const type = toast.type || 'success';

  let icon = <CheckCircle2 size={20} color="#10b981" />;
  let borderColor = 'rgba(16, 185, 129, 0.4)';
  let bgGlow = 'rgba(16, 185, 129, 0.12)';
  let accentColor = '#10b981';

  if (type === 'auth_register') {
    icon = <Sparkles size={20} color="#818cf8" />;
    borderColor = 'rgba(99, 102, 241, 0.5)';
    bgGlow = 'rgba(99, 102, 241, 0.15)';
    accentColor = '#818cf8';
  } else if (type === 'auth_login') {
    icon = <UserCheck size={20} color="#06b6d4" />;
    borderColor = 'rgba(6, 182, 212, 0.5)';
    bgGlow = 'rgba(6, 182, 212, 0.15)';
    accentColor = '#06b6d4';
  } else if (type === 'auth_logout') {
    icon = <LogOut size={20} color="#f43f5e" />;
    borderColor = 'rgba(244, 63, 94, 0.5)';
    bgGlow = 'rgba(244, 63, 94, 0.15)';
    accentColor = '#f43f5e';
  } else if (type === 'wishlist') {
    icon = <Heart size={20} color="#f43f5e" fill="#f43f5e" />;
    borderColor = 'rgba(244, 63, 94, 0.4)';
    bgGlow = 'rgba(244, 63, 94, 0.12)';
    accentColor = '#f43f5e';
  } else if (type === 'alert') {
    icon = <Bell size={20} color="#fbbf24" />;
    borderColor = 'rgba(245, 158, 11, 0.4)';
    bgGlow = 'rgba(245, 158, 11, 0.12)';
    accentColor = '#fbbf24';
  } else if (type === 'error') {
    icon = <AlertCircle size={20} color="#ef4444" />;
    borderColor = 'rgba(239, 68, 68, 0.5)';
    bgGlow = 'rgba(239, 68, 68, 0.15)';
    accentColor = '#ef4444';
  }

  return (
    <div style={{
      pointerEvents: 'auto',
      background: `linear-gradient(135deg, ${bgGlow} 0%, rgba(13, 18, 31, 0.95) 100%)`,
      backdropFilter: 'blur(16px)',
      border: `1px solid ${borderColor}`,
      borderRadius: 'var(--radius-lg)',
      padding: '1rem 1.25rem',
      boxShadow: `0 15px 35px -5px rgba(0, 0, 0, 0.8), 0 0 25px ${bgGlow}`,
      display: 'flex',
      alignItems: 'flex-start',
      gap: '0.85rem',
      position: 'relative',
      overflow: 'hidden',
      animation: 'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
      {/* Icon container */}
      <div style={{
        padding: '0.45rem',
        borderRadius: 'var(--radius-sm)',
        background: 'rgba(255, 255, 255, 0.05)',
        border: `1px solid ${borderColor}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}>
        {icon}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0, paddingRight: '0.5rem' }}>
        <h4 style={{
          fontSize: '0.92rem',
          fontWeight: 800,
          margin: '0 0 0.2rem 0',
          color: '#fff',
          letterSpacing: '-0.01em'
        }}>
          {toast.title}
        </h4>
        <p style={{
          fontSize: '0.8rem',
          color: 'var(--text-muted)',
          margin: 0,
          lineHeight: 1.4
        }}>
          {toast.message}
        </p>
      </div>

      {/* Dismiss button */}
      <button
        onClick={onDismiss}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'var(--text-dim)',
          cursor: 'pointer',
          padding: '0.2rem',
          borderRadius: 'var(--radius-sm)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'color 0.2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-dim)'}
      >
        <X size={16} />
      </button>

      {/* Animated bottom progress line */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        height: '3px',
        width: '100%',
        background: accentColor,
        boxShadow: `0 0 8px ${accentColor}`,
        animation: `shrink ${toast.duration || 4500}ms linear forwards`
      }} />
    </div>
  );
}
