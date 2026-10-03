import React, { useEffect, useState } from 'react';
import { X, LineChart, TrendingDown, ArrowUpRight, ArrowDownRight, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import { fetchPriceHistory } from '../services/api';

export default function PriceHistoryModal({ product, onClose }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!product) return;
    setLoading(true);
    fetchPriceHistory(product.link, product.price, product.platform)
      .then((data) => {
        setHistory(data || []);
      })
      .catch((err) => {
        console.error('Failed to load history:', err);
      })
      .finally(() => setLoading(false));
  }, [product]);

  if (!product) return null;

  const prices = history.map((h) => h.price);
  const minPrice = prices.length ? Math.min(...prices) : product.price || 0;
  const maxPrice = prices.length ? Math.max(...prices) : product.price || 0;
  const currentPrice = product.price || 0;
  const priceDiff = maxPrice - currentPrice;
  const isGoodDeal = currentPrice <= minPrice * 1.05;

  // Render responsive SVG line chart
  const renderChart = () => {
    if (history.length < 2) {
      return (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-dim)' }}>
          Tracking initialized today. Price history will accumulate over time.
        </div>
      );
    }

    const width = 500;
    const height = 180;
    const padding = 30;

    const range = maxPrice - minPrice || 1;
    const points = history.map((item, idx) => {
      const x = padding + (idx / (history.length - 1)) * (width - 2 * padding);
      const y = height - padding - ((item.price - minPrice) / range) * (height - 2 * padding);
      return { x, y, ...item };
    });

    const pathD = points.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`, '');

    return (
      <div style={{ width: '100%', overflowX: 'auto', padding: '0.5rem 0' }}>
        <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
          <defs>
            <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="glow" />
              <feComposite in="SourceGraphic" in2="glow" operator="over" />
            </filter>
          </defs>

          {/* Fill under line */}
          <path
            d={`${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`}
            fill="url(#chartGlow)"
          />

          {/* Stroke line */}
          <path d={pathD} fill="none" stroke="#06b6d4" strokeWidth="3.5" strokeLinecap="round" filter="url(#glow)" />

          {/* Points */}
          {points.map((pt, idx) => (
            <g key={idx}>
              <circle cx={pt.x} cy={pt.y} r="5.5" fill="#07090e" stroke="#06b6d4" strokeWidth="2.5" />
              <text
                x={pt.x}
                y={pt.y - 12}
                fill="#f8fafc"
                fontSize="11"
                textAnchor="middle"
                fontWeight="700"
              >
                ₹{pt.price}
              </text>
              <text
                x={pt.x}
                y={height - 8}
                fill="var(--text-dim)"
                fontSize="9.5"
                textAnchor="middle"
                fontWeight="500"
              >
                {pt.timestamp ? pt.timestamp.split(' ')[0].slice(5) : ''}
              </text>
            </g>
          ))}
        </svg>
      </div>
    );
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
        maxWidth: '620px',
        width: '100%',
        padding: '2rem',
        background: 'rgba(13, 18, 31, 0.95)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 40px rgba(6, 182, 212, 0.15)',
        position: 'relative'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'rgba(255, 255, 255, 0.08)',
            border: 'none',
            color: 'var(--text-muted)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.45rem',
            cursor: 'pointer'
          }}
        >
          <X size={18} />
        </button>

        {/* Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
          <div style={{
            padding: '0.4rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(6, 182, 212, 0.15)',
            border: '1px solid rgba(6, 182, 212, 0.3)'
          }}>
            <LineChart size={22} color="var(--accent-cyan)" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, color: '#fff', letterSpacing: '-0.02em' }}>
              Price Trend & Fluctuation History
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Historical price drops & optimal purchase timing
            </span>
          </div>
        </div>

        <p style={{
          fontSize: '0.9rem',
          color: 'var(--text-main)',
          fontWeight: 600,
          margin: '0.75rem 0 1.25rem 0',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {product.title}
        </p>

        {/* Stat Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0.85rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'block', fontWeight: 600 }}>Current Price</span>
            <strong style={{ fontSize: '1.25rem', color: '#fff', fontWeight: 800 }}>₹{currentPrice.toLocaleString('en-IN')}</strong>
          </div>
          <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16, 185, 129, 0.25)', textAlign: 'center' }}>
            <span style={{ fontSize: '0.72rem', color: '#10b981', display: 'block', fontWeight: 600 }}>Lowest Seen</span>
            <strong style={{ fontSize: '1.25rem', color: 'var(--accent-emerald)', fontWeight: 800 }}>₹{minPrice.toLocaleString('en-IN')}</strong>
          </div>
          <div style={{ background: 'rgba(244, 63, 94, 0.08)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(244, 63, 94, 0.25)', textAlign: 'center' }}>
            <span style={{ fontSize: '0.72rem', color: '#f43f5e', display: 'block', fontWeight: 600 }}>Highest Seen</span>
            <strong style={{ fontSize: '1.25rem', color: 'var(--accent-rose)', fontWeight: 800 }}>₹{maxPrice.toLocaleString('en-IN')}</strong>
          </div>
        </div>

        {/* Chart View */}
        <div style={{ background: 'rgba(0, 0, 0, 0.35)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', marginBottom: '1.5rem', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '160px', gap: '0.6rem' }}>
              <Loader2 size={24} className="animate-spin" color="var(--accent-cyan)" />
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Analyzing price telemetry...</span>
            </div>
          ) : (
            renderChart()
          )}
        </div>

        {/* Verdict Pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.75rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          background: isGoodDeal ? 'rgba(16, 185, 129, 0.12)' : 'rgba(99, 102, 241, 0.12)',
          border: isGoodDeal ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(99, 102, 241, 0.3)',
          marginBottom: '1.25rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={16} color={isGoodDeal ? '#10b981' : '#818cf8'} />
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: isGoodDeal ? '#10b981' : '#a5b4fc' }}>
              {isGoodDeal ? '🎯 Prime Buying Opportunity: Current price is near all-time low!' : '📊 Average Price: Good deal, but watch for flash sales.'}
            </span>
          </div>
        </div>

        <button onClick={onClose} className="btn-secondary" style={{ width: '100%', justifyContent: 'center', padding: '0.75rem' }}>
          Close Trend Analysis
        </button>
      </div>
    </div>
  );
}
