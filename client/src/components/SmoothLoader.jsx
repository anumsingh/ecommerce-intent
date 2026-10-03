import React, { useState, useEffect } from 'react';
import { Sparkles, ShoppingBag, Brain, ShieldCheck, Zap } from 'lucide-react';

export default function SmoothLoader({ query }) {
  const [step, setStep] = useState(0);

  const steps = [
    { text: 'Connecting to Scraping Microservices & Headless Clusters...', progress: 25 },
    { text: 'Extracting live catalog & prices from Amazon, Myntra, & Ajio...', progress: 60 },
    { text: 'Computing LightGBM Purchase Intent & finding best deals...', progress: 90 }
  ];

  useEffect(() => {
    const timer1 = setTimeout(() => setStep(1), 1200);
    const timer2 = setTimeout(() => setStep(2), 2600);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto 4rem auto',
      animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
      {/* Central Cyber Scanner HUD */}
      <div className="glass-panel" style={{
        padding: '2.25rem 2rem',
        marginBottom: '2.5rem',
        background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.6) 0%, rgba(13, 18, 31, 0.95) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.35)',
        boxShadow: '0 20px 50px -15px rgba(0, 0, 0, 0.8), 0 0 35px rgba(99, 102, 241, 0.15)',
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center'
      }}>
        {/* Holographic scanning radar beam */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.15), rgba(6, 182, 212, 0.25), transparent)',
          animation: 'scanner 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite',
          pointerEvents: 'none'
        }} />

        {/* Ambient Top Glow */}
        <div style={{
          position: 'absolute',
          top: '-30px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '300px',
          height: '80px',
          background: 'rgba(99, 102, 241, 0.3)',
          filter: 'blur(40px)',
          pointerEvents: 'none'
        }} />

        {/* Dynamic Spinning Rings Icon */}
        <div style={{
          position: 'relative',
          width: '72px',
          height: '72px',
          margin: '0 auto 1.25rem auto'
        }}>
          {/* Outer glow ring */}
          <div style={{
            position: 'absolute',
            inset: -4,
            borderRadius: '50%',
            border: '2px dashed rgba(99, 102, 241, 0.4)',
            animation: 'spin 8s linear infinite'
          }} />
          {/* Middle counter-rotating ring */}
          <div style={{
            position: 'absolute',
            inset: 2,
            borderRadius: '50%',
            border: '2px solid transparent',
            borderTopColor: '#06b6d4',
            borderRightColor: '#818cf8',
            animation: 'spinReverse 1.5s linear infinite'
          }} />
          {/* Core Center Icon */}
          <div style={{
            position: 'absolute',
            inset: 8,
            borderRadius: '50%',
            background: 'var(--gradient-btn)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(99, 102, 241, 0.6)'
          }}>
            <Sparkles size={24} color="#fff" className="animate-pulse-glow" />
          </div>
        </div>

        {/* Scanning Header & Query */}
        <h3 style={{
          fontSize: '1.45rem',
          fontWeight: 800,
          margin: '0 0 0.4rem 0',
          color: '#fff',
          letterSpacing: '-0.02em'
        }}>
          Scraping Live Stores for <span style={{
            background: 'linear-gradient(135deg, #a5b4fc, #38bdf8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>"{query}"</span>
        </h3>

        <p style={{
          fontSize: '0.88rem',
          color: 'var(--text-muted)',
          margin: '0 auto 1.5rem auto',
          maxWidth: '550px'
        }}>
          {steps[step].text}
        </p>

        {/* Smooth Neon Progress Bar */}
        <div style={{
          maxWidth: '460px',
          height: '8px',
          margin: '0 auto 1.75rem auto',
          background: 'rgba(255, 255, 255, 0.06)',
          borderRadius: 'var(--radius-full)',
          overflow: 'hidden',
          padding: '1px',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div style={{
            height: '100%',
            width: `${steps[step].progress}%`,
            background: 'linear-gradient(90deg, #6366f1 0%, #3b82f6 50%, #06b6d4 100%)',
            borderRadius: 'var(--radius-full)',
            transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 0 14px rgba(6, 182, 212, 0.6)'
          }} />
        </div>

        {/* Live Store Status Chips */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          <StoreScanChip
            name="Amazon India"
            color="#ff9900"
            active={true}
            pingText="Parsing HTML..."
          />
          <StoreScanChip
            name="Myntra Fashion"
            color="#ff3f6c"
            active={true}
            pingText="Fetching API..."
          />
          <StoreScanChip
            name="Ajio Trends"
            color="#60a5fa"
            active={true}
            pingText="Extracting JSON..."
          />
        </div>
      </div>

      {/* Shimmering Skeleton Columns Matching Real UI Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.75rem'
      }}>
        {[
          { name: 'Amazon India', color: '#ff9900' },
          { name: 'Myntra Fashion', color: '#ff3f6c' },
          { name: 'Ajio Trends', color: '#60a5fa' }
        ].map((store, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Header skeleton */}
            <div className="glass-panel" style={{
              padding: '1rem 1.4rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              border: `1px solid ${store.color}35`,
              background: `linear-gradient(135deg, ${store.color}10 0%, rgba(13, 18, 31, 0.8) 100%)`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-sm)', background: `${store.color}25` }} />
                <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#fff' }}>{store.name}</span>
              </div>
              <div style={{
                width: '65px',
                height: '22px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(255, 255, 255, 0.08)'
              }} className="animate-shimmer" />
            </div>

            {/* Product card skeletons */}
            {[1, 2].map((cardIdx) => (
              <div
                key={cardIdx}
                className="glass-panel"
                style={{
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  background: 'rgba(13, 18, 31, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.06)'
                }}
              >
                {/* Badge skeleton */}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ width: '70px', height: '22px', borderRadius: 'var(--radius-full)', background: 'rgba(255, 255, 255, 0.06)' }} className="animate-shimmer" />
                  <div style={{ width: '28px', height: '28px', borderRadius: 'var(--radius-sm)', background: 'rgba(255, 255, 255, 0.06)' }} />
                </div>

                {/* Image placeholder skeleton */}
                <div style={{
                  height: '160px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(0, 0, 0, 0.35)',
                  border: '1px solid rgba(255, 255, 255, 0.03)',
                  position: 'relative',
                  overflow: 'hidden'
                }} className="animate-shimmer" />

                {/* Text lines skeleton */}
                <div style={{ height: '16px', width: '85%', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.06)' }} className="animate-shimmer" />
                <div style={{ height: '14px', width: '50%', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.04)' }} className="animate-shimmer" />

                {/* Price & Buttons skeleton */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                  <div style={{ height: '24px', width: '90px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.08)' }} className="animate-shimmer" />
                  <div style={{ height: '36px', width: '120px', borderRadius: 'var(--radius-md)', background: 'rgba(255, 255, 255, 0.08)' }} className="animate-shimmer" />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function StoreScanChip({ name, color, active, pingText }) {
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.55rem',
      padding: '0.45rem 1rem',
      borderRadius: 'var(--radius-full)',
      background: 'rgba(255, 255, 255, 0.03)',
      border: `1px solid ${color}40`,
      fontSize: '0.78rem'
    }}>
      <span style={{
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: color,
        boxShadow: `0 0 10px ${color}`,
        animation: 'pulse-glow 1.5s infinite'
      }} />
      <span style={{ fontWeight: 700, color: '#fff' }}>{name}</span>
      <span style={{ color: 'var(--text-dim)', fontSize: '0.72rem' }}>• {pingText}</span>
    </div>
  );
}
