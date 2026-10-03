import React, { useState } from 'react';
import { Search, Loader2, Sparkles, Flame, Zap, ShieldCheck } from 'lucide-react';

export default function SearchHeader({ onSearch, loading, currentQuery, selectedPlatform, onSelectPlatform }) {
  const [inputVal, setInputVal] = useState('');

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (inputVal.trim() && !loading) {
      onSearch(inputVal.trim());
    }
  };

  const handleQuickTagClick = (tag) => {
    setInputVal(tag);
    onSearch(tag);
  };

  const quickTags = [
    { label: 'Wireless Headphones', icon: '🎧' },
    { label: 'Gaming Laptop', icon: '💻' },
    { label: 'Nike Air Max', icon: '👟' },
    { label: 'boAt Earphones', icon: '⚡' },
    { label: 'Smartwatch', icon: '⌚' }
  ];

  return (
    <div style={{ textAlign: 'center', margin: '1.5rem auto 3rem auto', maxWidth: '900px', position: 'relative' }}>
      {/* Ambient background glow */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '450px',
        height: '180px',
        background: 'radial-gradient(ellipse, rgba(99, 102, 241, 0.25) 0%, rgba(6, 182, 212, 0.15) 50%, transparent 80%)',
        filter: 'blur(50px)',
        zIndex: -1,
        pointerEvents: 'none'
      }} />

      {/* Pill Badge */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        padding: '0.35rem 0.9rem',
        borderRadius: 'var(--radius-full)',
        background: 'rgba(99, 102, 241, 0.12)',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        marginBottom: '1.25rem',
        fontSize: '0.78rem',
        color: '#c7d2fe',
        fontWeight: 700,
        boxShadow: '0 0 20px rgba(99, 102, 241, 0.2)'
      }}>
        <Sparkles size={14} color="#818cf8" />
        <span>Next-Gen E-Commerce Price Intelligence</span>
      </div>

      {/* Hero Title */}
      <h1 style={{
        fontSize: 'clamp(2.2rem, 5vw, 3.25rem)',
        fontWeight: 800,
        letterSpacing: '-0.035em',
        lineHeight: 1.15,
        marginBottom: '1rem',
        background: 'linear-gradient(135deg, #ffffff 20%, #e2e8f0 60%, #93c5fd 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textShadow: '0 0 40px rgba(255, 255, 255, 0.1)'
      }}>
        Compare Real-Time Prices Across India's Top Stores
      </h1>
      
      <p style={{
        fontSize: '1.05rem',
        color: 'var(--text-muted)',
        marginBottom: '2rem',
        maxWidth: '650px',
        margin: '0 auto 2rem auto',
        lineHeight: 1.6
      }}>
        Simultaneously scrape <strong style={{ color: '#ff9900' }}>Amazon</strong>, <strong style={{ color: '#ff3f6c' }}>Myntra</strong>, and <strong style={{ color: '#60a5fa' }}>Ajio</strong> with AI-powered intent analytics and smart deal discovery.
      </p>

      {/* Futuristic Search Bar */}
      <form onSubmit={handleFormSubmit} style={{ position: 'relative', marginBottom: '1.5rem', maxWidth: '780px', margin: '0 auto 1.5rem auto' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: 'var(--radius-xl)',
          padding: '0.55rem 0.65rem 0.55rem 1.4rem',
          boxShadow: '0 12px 40px -10px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.05), 0 0 25px rgba(99, 102, 241, 0.15)',
          transition: 'all 0.3s ease',
          backdropFilter: 'blur(16px)'
        }}>
          <Search size={22} color="#818cf8" style={{ marginRight: '0.85rem', flexShrink: 0 }} />
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Search any product (e.g. Sony WH-1000XM5, Nike Air Max, Macbook Air)..."
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#fff',
              fontSize: '1.05rem',
              fontFamily: 'inherit',
              fontWeight: 500
            }}
          />
          <button
            type="submit"
            disabled={loading || !inputVal.trim()}
            className="btn-primary"
            style={{
              borderRadius: 'var(--radius-lg)',
              padding: '0.75rem 1.6rem',
              opacity: loading || !inputVal.trim() ? 0.6 : 1,
              flexShrink: 0,
              fontSize: '0.92rem'
            }}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Scraping Stores...</span>
              </>
            ) : (
              <>
                <Sparkles size={17} />
                <span>Compare Prices</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Quick Tags Chips */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.75rem' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600 }}>Trending:</span>
        {quickTags.map((tag) => (
          <button
            key={tag.label}
            onClick={() => handleQuickTagClick(tag.label)}
            className="btn-secondary"
            style={{
              padding: '0.3rem 0.85rem',
              fontSize: '0.78rem',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(255, 255, 255, 0.04)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <span>{tag.icon}</span>
            <span>{tag.label}</span>
          </button>
        ))}
      </div>

      {/* Platform Filter Tabs */}
      <div style={{
        display: 'inline-flex',
        background: 'rgba(15, 23, 42, 0.8)',
        padding: '5px',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)'
      }}>
        {[
          { key: 'all', label: 'All Stores', color: '#818cf8' },
          { key: 'amazon', label: 'Amazon India', color: '#ff9900' },
          { key: 'myntra', label: 'Myntra', color: '#ff3f6c' },
          { key: 'ajio', label: 'Ajio Trends', color: '#60a5fa' }
        ].map((platform) => {
          const isActive = selectedPlatform === platform.key;
          return (
            <button
              key={platform.key}
              onClick={() => onSelectPlatform(platform.key)}
              style={{
                background: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                color: isActive ? '#fff' : 'var(--text-muted)',
                border: isActive ? `1px solid ${platform.color}80` : '1px solid transparent',
                padding: '0.45rem 1.15rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                boxShadow: isActive ? `0 0 12px ${platform.color}25` : 'none'
              }}
            >
              {platform.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
