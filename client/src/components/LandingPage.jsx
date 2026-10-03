import React, { useState } from 'react';
import {
  Brain,
  Search,
  TrendingUp,
  Sparkles,
  ShoppingBag,
  Zap,
  ShieldCheck,
  ArrowRight,
  Store,
  Layers,
  Activity,
  CheckCircle2,
  Lock,
  LineChart,
  Bell,
  Download
} from 'lucide-react';

export default function LandingPage({
  onSearchDemo,
  onOpenAuth,
  demoSearchesLeft,
  onGoToDashboard,
  isLoggedIn,
  userName
}) {
  const [demoQuery, setDemoQuery] = useState('');

  const trendingTopics = [
    'Wireless Noise Cancelling Headphones',
    'Puma Running Shoes',
    'Smart Watches for Men',
    'Casual Denim Jackets'
  ];

  const handleDemoSubmit = (e) => {
    e.preventDefault();
    if (!demoQuery.trim()) return;
    onSearchDemo(demoQuery.trim());
  };

  return (
    <div style={{ paddingBottom: '3rem' }}>
      {/* Hero Section */}
      <div style={{
        position: 'relative',
        padding: '3.5rem 2rem 4.5rem 2rem',
        borderRadius: 'var(--radius-xl)',
        background: 'linear-gradient(135deg, rgba(13, 18, 31, 0.95) 0%, rgba(20, 27, 45, 0.9) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.25)',
        boxShadow: '0 25px 60px -20px rgba(0, 0, 0, 0.9), 0 0 45px rgba(99, 102, 241, 0.15)',
        textAlign: 'center',
        overflow: 'hidden',
        marginBottom: '3rem'
      }}>
        {/* Background glow effects */}
        <div style={{
          position: 'absolute',
          top: '-120px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '500px',
          height: '250px',
          background: 'radial-gradient(ellipse, rgba(99, 102, 241, 0.35) 0%, rgba(6, 182, 212, 0.15) 50%, transparent 80%)',
          filter: 'blur(60px)',
          pointerEvents: 'none'
        }} />

        {/* Hero Badges */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.35rem 0.95rem',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(99, 102, 241, 0.18)',
            border: '1px solid rgba(99, 102, 241, 0.4)',
            color: '#a5b4fc',
            fontSize: '0.8rem',
            fontWeight: 700,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            boxShadow: '0 0 15px rgba(99, 102, 241, 0.25)'
          }}>
            <Brain size={15} color="#818cf8" />
            LightGBM Real-Time Behavioral ML
          </span>

          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.35rem 0.95rem',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            color: '#34d399',
            fontSize: '0.8rem',
            fontWeight: 700,
            letterSpacing: '0.04em',
            textTransform: 'uppercase'
          }}>
            <Store size={15} color="#34d399" />
            Live Amazon • Myntra • Ajio
          </span>
        </div>

        {/* Main Hero Headline */}
        <h1 style={{
          fontSize: 'clamp(2.1rem, 4.5vw, 3.4rem)',
          fontWeight: 900,
          letterSpacing: '-0.03em',
          lineHeight: 1.18,
          marginBottom: '1.25rem',
          maxWidth: '900px',
          margin: '0 auto 1.25rem auto',
          background: 'linear-gradient(135deg, #ffffff 30%, #c7d2fe 75%, #818cf8 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Multi-Store Price Intelligence & Real-Time ML Intent Engine
        </h1>

        <p style={{
          fontSize: 'clamp(0.95rem, 1.8vw, 1.15rem)',
          color: 'var(--text-muted)',
          maxWidth: '720px',
          margin: '0 auto 2.25rem auto',
          lineHeight: 1.6
        }}>
          Compare live prices across top e-commerce merchants simultaneously while our LightGBM machine learning model predicts real-time purchase intent through sequential browsing telemetry.
        </p>

        {/* Interactive Demo Search Bar */}
        <div style={{ maxWidth: '680px', margin: '0 auto 1.5rem auto' }}>
          <form onSubmit={handleDemoSubmit} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={22} color="var(--text-dim)" style={{ position: 'absolute', left: '1.25rem' }} />
            <input
              type="text"
              value={demoQuery}
              onChange={(e) => setDemoQuery(e.target.value)}
              placeholder="Test demo search (e.g. Puma Running Shoes, Smart Watch)..."
              style={{
                width: '100%',
                padding: '1.15rem 10.5rem 1.15rem 3.4rem',
                fontSize: '1rem',
                borderRadius: 'var(--radius-xl)',
                background: 'rgba(0, 0, 0, 0.45)',
                border: '1px solid rgba(99, 102, 241, 0.4)',
                color: '#fff',
                fontFamily: 'inherit',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
              }}
            />
            <button
              type="submit"
              className="btn-primary"
              style={{
                position: 'absolute',
                right: '0.5rem',
                padding: '0.75rem 1.35rem',
                fontSize: '0.9rem',
                borderRadius: 'var(--radius-lg)'
              }}
            >
              <Zap size={16} />
              <span>Demo Search</span>
            </button>
          </form>

          {/* Demo Quota Indicator */}
          {!isLoggedIn ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.65rem',
              marginTop: '0.85rem',
              fontSize: '0.78rem',
              color: 'var(--text-dim)'
            }}>
              <span style={{
                padding: '0.2rem 0.65rem',
                borderRadius: 'var(--radius-full)',
                background: demoSearchesLeft > 0 ? 'rgba(52, 211, 153, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                color: demoSearchesLeft > 0 ? '#34d399' : '#fb7185',
                fontWeight: 700,
                border: `1px solid ${demoSearchesLeft > 0 ? 'rgba(52, 211, 153, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`
              }}>
                {demoSearchesLeft > 0 ? `Guest Pass: ${demoSearchesLeft} Free Demo Searches Left` : 'Guest Limit Reached'}
              </span>
              <span>•</span>
              <button
                type="button"
                onClick={onOpenAuth}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#818cf8',
                  cursor: 'pointer',
                  fontWeight: 700,
                  textDecoration: 'underline',
                  padding: 0
                }}
              >
                Sign In / Register for Unlimited Searches
              </button>
            </div>
          ) : (
            <div style={{ marginTop: '0.85rem' }}>
              <button
                type="button"
                onClick={onGoToDashboard}
                className="btn-secondary"
                style={{
                  padding: '0.55rem 1.25rem',
                  fontSize: '0.85rem',
                  borderColor: 'rgba(99, 102, 241, 0.5)',
                  background: 'rgba(99, 102, 241, 0.15)',
                  color: '#c7d2fe',
                  margin: '0 auto'
                }}
              >
                <Sparkles size={16} color="#818cf8" />
                <span>Logged in as {userName} • Open Full AI Engine Dashboard</span>
                <ArrowRight size={15} />
              </button>
            </div>
          )}
        </div>

        {/* Trending Searches Pills */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: 600 }}>
            Trending Demos:
          </span>
          {trendingTopics.map((topic, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSearchDemo(topic)}
              style={{
                fontSize: '0.75rem',
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.color = 'var(--text-muted)';
              }}
            >
              <TrendingUp size={12} color="#818cf8" />
              <span>{topic}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 4 Core Pillars Feature Grid */}
      <div style={{ marginBottom: '3.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>
            Engineered for Precision E-Commerce Intelligence
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>
            Combining multi-store scrapers with sequential machine learning session tracking.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem'
        }}>
          {/* Card 1 */}
          <div className="glass-panel" style={{
            padding: '1.75rem',
            borderRadius: 'var(--radius-lg)',
            background: 'rgba(13, 18, 31, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(6, 182, 212, 0.15)',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}>
              <Store size={22} color="#06b6d4" />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem', color: '#fff' }}>
              Multi-Store Real-Time Scraper
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
              Parallel scraping engines pull live catalog items, real-time prices, ratings, and stock status across Amazon, Myntra, and Ajio in milliseconds.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-panel" style={{
            padding: '1.75rem',
            borderRadius: 'var(--radius-lg)',
            background: 'rgba(13, 18, 31, 0.75)',
            border: '1px solid rgba(99, 102, 241, 0.25)'
          }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(99, 102, 241, 0.18)',
              border: '1px solid rgba(99, 102, 241, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}>
              <Brain size={22} color="#818cf8" />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem', color: '#fff' }}>
              Sequential ML Intent Engine
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
              LightGBM GBDT trained on 14 behavioral features calculating real-time purchase likelihood across Exploration, Comparison, Commitment, and Decision Focus.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-panel" style={{
            padding: '1.75rem',
            borderRadius: 'var(--radius-lg)',
            background: 'rgba(13, 18, 31, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}>
              <LineChart size={22} color="#f59e0b" />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem', color: '#fff' }}>
              Historical Price Radar
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
              Interactive SVG trend graphs benchmark current price against 90-day lowest/highest records to deliver instant "Great Deal" or "Wait for Price Drop" verdicts.
            </p>
          </div>

          {/* Card 4 */}
          <div className="glass-panel" style={{
            padding: '1.75rem',
            borderRadius: 'var(--radius-lg)',
            background: 'rgba(13, 18, 31, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(244, 63, 94, 0.15)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}>
              <Bell size={22} color="#f43f5e" />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem', color: '#fff' }}>
              Price Drop Alerts & Cloud Wishlist
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
              Arm price drop alerts and save products to your MongoDB Atlas cloud wishlist to automatically track future discounts and export price matrices to Excel.
            </p>
          </div>
        </div>
      </div>

      {/* Architecture & Tech Pipeline */}
      <div className="glass-panel" style={{
        padding: '2.5rem',
        borderRadius: 'var(--radius-xl)',
        background: 'rgba(13, 18, 31, 0.85)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        marginBottom: '3rem'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span style={{ fontSize: '0.78rem', color: '#818cf8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            System Architecture
          </span>
          <h2 style={{ fontSize: '1.65rem', fontWeight: 800, margin: '0.25rem 0 0 0' }}>
            How OmniPrice Predicts Purchase Intent in Real Time
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          position: 'relative'
        }}>
          <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 700 }}>STEP 1</span>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0.35rem 0' }}>Telemetry Stream</h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
              Captures dwell time, store switches, price history clicks, and wishlist additions.
            </p>
          </div>

          <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.72rem', color: '#a855f7', fontWeight: 700 }}>STEP 2</span>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0.35rem 0' }}>Feature Extraction</h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
              Extracts 14 sequential temporal deltas and multi-aspect behavioral metrics.
            </p>
          </div>

          <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.72rem', color: '#f59e0b', fontWeight: 700 }}>STEP 3</span>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0.35rem 0' }}>LightGBM Inference</h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
              Python Flask microservice scores likelihood and categorizes intent level.
            </p>
          </div>

          <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 700 }}>STEP 4</span>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0.35rem 0' }}>Adaptive UI & Deals</h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
              React client presents real-time diagnostic stream, price verdicts, and alerts.
            </p>
          </div>
        </div>
      </div>

      {/* Unlock Full Engine Banner (When Logged Out) */}
      {!isLoggedIn && (
        <div style={{
          padding: '2.5rem 2rem',
          borderRadius: 'var(--radius-xl)',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(13, 18, 31, 0.95) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.4)',
          textAlign: 'center',
          boxShadow: '0 20px 50px -15px rgba(0, 0, 0, 0.8)'
        }}>
          <h3 style={{ fontSize: '1.65rem', fontWeight: 800, margin: '0 0 0.75rem 0' }}>
            Ready to Unlock Unlimited AI Price Searches?
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', maxWidth: '580px', margin: '0 auto 1.5rem auto' }}>
            Sign in or create your free account to access unlimited multi-store comparisons, save wishlists, and track price drops on MongoDB Atlas.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={onOpenAuth}
              className="btn-primary"
              style={{ padding: '0.85rem 2rem', fontSize: '0.95rem' }}
            >
              <Sparkles size={18} />
              <span>Sign In / Create Account</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
