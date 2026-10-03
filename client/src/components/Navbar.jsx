import React from 'react';
import {
  ShoppingBag,
  Brain,
  Heart,
  User,
  LogOut,
  Download,
  Home,
  LayoutDashboard,
  Zap,
  Sparkles
} from 'lucide-react';

export default function Navbar({
  user,
  onOpenAuth,
  onLogout,
  onOpenWishlist,
  wishlistCount,
  onToggleIntentPanel,
  showIntentPanel,
  onExport,
  hasResults,
  currentView,
  onNavigate,
  demoSearchesLeft
}) {
  return (
    <nav className="glass-panel" style={{
      position: 'sticky',
      top: '1rem',
      zIndex: 50,
      margin: '0 auto 2rem auto',
      padding: '0.9rem 1.85rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      maxWidth: '1400px',
      borderRadius: 'var(--radius-xl)',
      background: 'rgba(13, 18, 31, 0.85)',
      boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.12)',
      flexWrap: 'wrap',
      gap: '1rem'
    }}>
      {/* Brand Logo & View Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div
          onClick={() => onNavigate('home')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', cursor: 'pointer' }}
        >
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--gradient-btn)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 25px rgba(99, 102, 241, 0.5)',
            position: 'relative'
          }}>
            <ShoppingBag size={20} color="#fff" />
            <div style={{
              position: 'absolute',
              inset: -2,
              borderRadius: 'var(--radius-md)',
              background: 'var(--gradient-btn)',
              opacity: 0.3,
              filter: 'blur(6px)',
              zIndex: -1
            }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{
                fontSize: '1.3rem',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                background: 'linear-gradient(135deg, #ffffff 40%, #c7d2fe 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                OmniPrice
              </span>
              <span style={{
                fontSize: '0.65rem',
                fontWeight: 800,
                padding: '0.15rem 0.55rem',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(99, 102, 241, 0.25)',
                color: '#a5b4fc',
                border: '1px solid rgba(99, 102, 241, 0.5)',
                letterSpacing: '0.05em',
                textTransform: 'uppercase'
              }}>
                AI • MERN
              </span>
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0, fontWeight: 500 }}>
              Multi-Store Scraping & LightGBM Purchase Intent
            </p>
          </div>
        </div>

        {/* Home / Dashboard View Switcher */}
        <div style={{
          display: 'flex',
          background: 'rgba(0, 0, 0, 0.35)',
          padding: '3px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <button
            type="button"
            onClick={() => onNavigate('home')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.4rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: currentView === 'home' ? 'rgba(99, 102, 241, 0.25)' : 'transparent',
              color: currentView === 'home' ? '#fff' : 'var(--text-muted)',
              fontWeight: currentView === 'home' ? 700 : 500,
              fontSize: '0.78rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <Home size={14} />
            <span>Home</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.4rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: currentView === 'dashboard' ? 'var(--gradient-btn)' : 'transparent',
              color: currentView === 'dashboard' ? '#fff' : 'var(--text-muted)',
              fontWeight: currentView === 'dashboard' ? 700 : 500,
              fontSize: '0.78rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: currentView === 'dashboard' ? '0 0 12px rgba(99, 102, 241, 0.4)' : 'none'
            }}
          >
            <LayoutDashboard size={14} />
            <span>AI Platform</span>
          </button>
        </div>
      </div>

      {/* Action Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        {/* Toggle ML Intent Panel (Dashboard mode) */}
        {currentView === 'dashboard' && (
          <button
            onClick={onToggleIntentPanel}
            className="btn-secondary"
            style={{
              borderColor: showIntentPanel ? 'rgba(99, 102, 241, 0.6)' : 'var(--border-color)',
              background: showIntentPanel ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.04)',
              color: showIntentPanel ? '#c7d2fe' : 'var(--text-main)',
              fontSize: '0.78rem',
              padding: '0.45rem 0.85rem'
            }}
            title="Toggle Real-Time ML Intent Intelligence"
          >
            <Brain size={16} color="#818cf8" className={showIntentPanel ? 'animate-pulse-glow' : ''} />
            <span>Intent Engine</span>
          </button>
        )}

        {/* Export to Excel */}
        {currentView === 'dashboard' && hasResults && (
          <button
            onClick={onExport}
            className="btn-secondary"
            title="Export Price Matrix to Excel"
            style={{ color: '#34d399', borderColor: 'rgba(52, 211, 153, 0.3)', fontSize: '0.78rem', padding: '0.45rem 0.85rem' }}
          >
            <Download size={15} color="#34d399" />
            <span>Export Matrix</span>
          </button>
        )}

        {/* Wishlist Drawer Button */}
        <button
          onClick={onOpenWishlist}
          className="btn-secondary"
          style={{ position: 'relative', fontSize: '0.78rem', padding: '0.45rem 0.85rem' }}
          title="Saved Wishlist"
        >
          <Heart size={16} color="#f43f5e" fill={wishlistCount > 0 ? '#f43f5e' : 'none'} />
          <span>Wishlist</span>
          {wishlistCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-6px',
              right: '-6px',
              background: 'linear-gradient(135deg, #f43f5e, #e11d48)',
              color: '#fff',
              fontSize: '0.68rem',
              fontWeight: 800,
              padding: '1px 6px',
              borderRadius: 'var(--radius-full)',
              boxShadow: '0 0 10px rgba(244, 63, 94, 0.6)'
            }}>
              {wishlistCount}
            </span>
          )}
        </button>

        {/* Demo Search Badge when logged out */}
        {!user && (
          <span style={{
            fontSize: '0.74rem',
            padding: '0.35rem 0.75rem',
            borderRadius: 'var(--radius-full)',
            background: demoSearchesLeft > 0 ? 'rgba(52, 211, 153, 0.15)' : 'rgba(244, 63, 94, 0.15)',
            color: demoSearchesLeft > 0 ? '#34d399' : '#fb7185',
            fontWeight: 700,
            border: `1px solid ${demoSearchesLeft > 0 ? 'rgba(52, 211, 153, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`,
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}>
            <Zap size={13} />
            {demoSearchesLeft > 0 ? `${demoSearchesLeft} Demo Searches` : 'Limit Reached'}
          </span>
        )}

        {/* User Auth Section */}
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.45rem 0.85rem',
              background: 'rgba(99, 102, 241, 0.14)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(99, 102, 241, 0.35)'
            }}>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: 'var(--gradient-btn)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.72rem',
                fontWeight: 800
              }}>
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff' }}>{user.name}</span>
            </div>

            <button
              onClick={onLogout}
              className="btn-secondary"
              style={{ padding: '0.45rem 0.75rem', fontSize: '0.75rem', color: '#f43f5e', borderColor: 'rgba(244, 63, 94, 0.3)' }}
              title="Sign Out"
            >
              <LogOut size={14} color="#f43f5e" />
              <span>Log Out</span>
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="btn-primary"
            style={{ padding: '0.5rem 1.15rem', fontSize: '0.82rem' }}
          >
            <Sparkles size={15} />
            <span>Sign In / Register</span>
          </button>
        )}
      </div>
    </nav>
  );
}
