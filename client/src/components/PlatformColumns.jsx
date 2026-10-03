import React from 'react';
import ProductCard from './ProductCard';
import { ShoppingBag, ArrowUpRight } from 'lucide-react';

export default function PlatformColumns({
  products,
  selectedPlatform,
  onProductClick,
  onViewHistory,
  onSetAlert,
  onToggleWishlist,
  wishlistMap
}) {
  if (!products) return null;

  const platforms = [
    {
      key: 'amazon',
      name: 'Amazon India',
      color: '#ff9900',
      bgGlow: 'rgba(255, 153, 0, 0.08)',
      tagline: 'Electronics & Fast Delivery'
    },
    {
      key: 'myntra',
      name: 'Myntra Fashion',
      color: '#ff3f6c',
      bgGlow: 'rgba(255, 63, 108, 0.08)',
      tagline: 'Fashion & Trend Apparel'
    },
    {
      key: 'ajio',
      name: 'Ajio Trends',
      color: '#60a5fa',
      bgGlow: 'rgba(96, 165, 250, 0.08)',
      tagline: 'Direct Brand Deals'
    }
  ];

  const visiblePlatforms =
    selectedPlatform === 'all'
      ? platforms
      : platforms.filter((p) => p.key === selectedPlatform);

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${visiblePlatforms.length}, minmax(320px, 1fr))`,
      gap: '1.75rem',
      alignItems: 'start'
    }}>
      {visiblePlatforms.map((plat) => {
        const items = products[plat.key] || [];

        return (
          <div key={plat.key} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Platform Column Header */}
            <div className="glass-panel" style={{
              padding: '1rem 1.4rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: `linear-gradient(135deg, ${plat.bgGlow} 0%, rgba(13, 18, 31, 0.8) 100%)`,
              border: `1px solid ${plat.color}35`,
              borderRadius: 'var(--radius-lg)',
              boxShadow: `0 8px 24px -6px rgba(0, 0, 0, 0.5), 0 0 15px ${plat.color}15`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-sm)',
                  background: `${plat.color}20`,
                  border: `1px solid ${plat.color}40`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <ShoppingBag size={16} color={plat.color} />
                </div>
                <div>
                  <h3 style={{ fontSize: '0.98rem', fontWeight: 800, margin: 0, color: '#fff' }}>
                    {plat.name}
                  </h3>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    {plat.tagline}
                  </span>
                </div>
              </div>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 800,
                padding: '0.25rem 0.65rem',
                borderRadius: 'var(--radius-full)',
                background: `${plat.color}15`,
                color: plat.color,
                border: `1px solid ${plat.color}40`
              }}>
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </span>
            </div>

            {/* List of Products */}
            {items.length === 0 ? (
              <div className="glass-panel" style={{
                padding: '3rem 2rem',
                textAlign: 'center',
                color: 'var(--text-dim)',
                fontSize: '0.88rem',
                borderRadius: 'var(--radius-lg)'
              }}>
                No exact match found on {plat.name} for this search.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {items.map((prod, idx) => (
                  <ProductCard
                    key={`${plat.key}-${idx}`}
                    product={prod}
                    platform={plat.key}
                    onProductClick={onProductClick}
                    onViewHistory={onViewHistory}
                    onSetAlert={onSetAlert}
                    onToggleWishlist={onToggleWishlist}
                    isWishlisted={Boolean(wishlistMap[prod.link || prod.title])}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
