import React from 'react';
import { Tag, Sparkles, Flame, Star, ExternalLink, TrendingDown, CheckCircle2 } from 'lucide-react';

export default function ComparisonHighlights({
  lowest,
  bestDeal,
  bestSeller,
  bestRated,
  onProductClick,
  onViewHistory
}) {
  const cards = [
    {
      title: 'Lowest Price',
      subtitle: 'Maximum Savings',
      icon: <TrendingDown size={18} color="#10b981" />,
      product: lowest,
      badgeClass: 'badge-lowest',
      borderColor: 'rgba(16, 185, 129, 0.45)',
      glowColor: 'rgba(16, 185, 129, 0.12)',
      tagColor: '#10b981'
    },
    {
      title: 'Best Overall Deal',
      subtitle: 'Value for Money',
      icon: <Sparkles size={18} color="#818cf8" />,
      product: bestDeal,
      badgeClass: 'badge-deal',
      borderColor: 'rgba(99, 102, 241, 0.45)',
      glowColor: 'rgba(99, 102, 241, 0.12)',
      tagColor: '#818cf8'
    },
    {
      title: 'Best Seller',
      subtitle: 'Customer Favorite',
      icon: <Flame size={18} color="#fbbf24" />,
      product: bestSeller,
      badgeClass: 'badge-seller',
      borderColor: 'rgba(245, 158, 11, 0.45)',
      glowColor: 'rgba(245, 158, 11, 0.12)',
      tagColor: '#fbbf24'
    },
    {
      title: 'Top Rated',
      subtitle: 'Highest Reviews',
      icon: <Star size={18} color="#f472b6" fill="#f472b6" />,
      product: bestRated,
      badgeClass: 'badge-rated',
      borderColor: 'rgba(236, 72, 153, 0.45)',
      glowColor: 'rgba(236, 72, 153, 0.12)',
      tagColor: '#f472b6'
    }
  ];

  const hasAnyCard = cards.some(c => c.product);
  if (!hasAnyCard) return null;

  return (
    <div style={{ marginBottom: '3rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            padding: '0.4rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(99, 102, 241, 0.15)',
            border: '1px solid rgba(99, 102, 241, 0.3)'
          }}>
            <Sparkles size={18} color="var(--accent-primary)" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em', color: '#fff' }}>
              Smart Purchase Recommendations
            </h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
              AI automated comparison across Amazon, Myntra, and Ajio
            </p>
          </div>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.25rem'
      }}>
        {cards.map((card, idx) => {
          const p = card.product;
          if (!p) return null;

          return (
            <div
              key={idx}
              className="glass-panel glass-panel-hover"
              style={{
                padding: '1.35rem',
                border: `1px solid ${card.borderColor}`,
                background: `linear-gradient(180deg, ${card.glowColor} 0%, rgba(13, 18, 31, 0.8) 100%)`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'pointer',
                borderRadius: 'var(--radius-lg)',
                boxShadow: `0 10px 30px -10px rgba(0, 0, 0, 0.6), 0 0 20px ${card.glowColor}`
              }}
              onClick={() => {
                onProductClick(p, 'recommendation_click');
                onViewHistory(p);
              }}
            >
              {/* Header Badge */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  {card.icon}
                  <div>
                    <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#fff', display: 'block', lineHeight: 1.2 }}>
                      {card.title}
                    </span>
                    <span style={{ fontSize: '0.68rem', color: card.tagColor, fontWeight: 600 }}>
                      {card.subtitle}
                    </span>
                  </div>
                </div>
                <span className={`badge ${card.badgeClass}`}>
                  {p.platform || 'Store'}
                </span>
              </div>

              {/* Product Info */}
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.25rem' }}>
                {p.image ? (
                  <div style={{
                    width: '72px',
                    height: '72px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    padding: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <img
                      src={p.image}
                      alt={p.title}
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain'
                      }}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                ) : (
                  <div style={{
                    width: '72px',
                    height: '72px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255, 255, 255, 0.04)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Tag size={24} color="var(--text-dim)" />
                  </div>
                )}

                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 style={{
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    margin: '0 0 0.4rem 0',
                    color: 'var(--text-main)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }} title={p.title}>
                    {p.title}
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.45rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
                      ₹{p.price?.toLocaleString('en-IN')}
                    </span>
                    {p.rating && (
                      <span style={{ fontSize: '0.75rem', color: '#fbbf24', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '2px' }}>
                        ★ {p.rating}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div style={{ display: 'flex', gap: '0.6rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <a
                  href={p.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onProductClick(p, 'buy_click');
                  }}
                  className="btn-primary"
                  style={{ flex: 1, justifyContent: 'center', padding: '0.55rem 0.85rem', fontSize: '0.82rem', textDecoration: 'none' }}
                >
                  <span>Buy on {p.platform || 'Store'}</span>
                  <ExternalLink size={14} />
                </a>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewHistory(p);
                  }}
                  className="btn-secondary"
                  style={{ padding: '0.55rem 0.85rem', fontSize: '0.82rem' }}
                  title="Price Trend Analysis"
                >
                  Trend
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
