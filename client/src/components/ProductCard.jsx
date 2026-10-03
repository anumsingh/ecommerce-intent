import React from 'react';
import { ExternalLink, Heart, Bell, LineChart, Star, ShoppingCart } from 'lucide-react';

export default function ProductCard({
  product,
  platform,
  onProductClick,
  onViewHistory,
  onSetAlert,
  onToggleWishlist,
  isWishlisted
}) {
  const badgeClass =
    platform === 'amazon' ? 'badge-amazon' : platform === 'myntra' ? 'badge-myntra' : 'badge-ajio';
  
  const platformAccent =
    platform === 'amazon' ? '#ff9900' : platform === 'myntra' ? '#ff3f6c' : '#60a5fa';

  return (
    <div
      className="glass-panel glass-panel-hover"
      style={{
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRadius: 'var(--radius-lg)',
        background: 'rgba(13, 18, 31, 0.7)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        position: 'relative',
        cursor: 'pointer',
        boxShadow: '0 8px 24px -6px rgba(0, 0, 0, 0.5)'
      }}
      onClick={() => {
        onProductClick(product, 'product_view');
        onViewHistory(product);
      }}
    >
      {/* Top Bar: Store Badge & Wishlist Icon */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <span className={`badge ${badgeClass}`}>
          {platform}
        </span>

        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product);
            }}
            style={{
              background: isWishlisted ? 'rgba(244, 63, 94, 0.25)' : 'rgba(255, 255, 255, 0.04)',
              border: isWishlisted ? '1px solid var(--accent-rose)' : '1px solid rgba(255, 255, 255, 0.1)',
              color: isWishlisted ? '#f43f5e' : 'var(--text-muted)',
              padding: '0.45rem',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              boxShadow: isWishlisted ? '0 0 10px rgba(244, 63, 94, 0.4)' : 'none'
            }}
            title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <Heart size={15} fill={isWishlisted ? '#f43f5e' : 'none'} />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSetAlert(product);
            }}
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: 'var(--text-muted)',
              padding: '0.45rem',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease'
            }}
            title="Set Price Drop Alert"
          >
            <Bell size={15} />
          </button>
        </div>
      </div>

      {/* Product Image */}
      <div style={{
        height: '175px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1.25rem',
        borderRadius: 'var(--radius-md)',
        background: 'rgba(0, 0, 0, 0.3)',
        border: '1px solid rgba(255, 255, 255, 0.04)',
        padding: '0.85rem',
        overflow: 'hidden'
      }}>
        {product.image ? (
          <img
            src={product.image}
            alt={product.title}
            style={{
              maxHeight: '100%',
              maxWidth: '100%',
              objectFit: 'contain',
              transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            loading="lazy"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        ) : (
          <div style={{ color: 'var(--text-dim)', fontSize: '0.82rem', fontWeight: 500 }}>
            No Preview Available
          </div>
        )}
      </div>

      {/* Product Info */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <h3
            style={{
              fontSize: '0.92rem',
              fontWeight: 600,
              lineHeight: 1.45,
              marginBottom: '0.65rem',
              color: 'var(--text-main)',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              minHeight: '2.7em'
            }}
            title={product.title}
          >
            {product.title}
          </h3>

          {/* Price & Rating */}
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div>
              <span style={{
                fontSize: '1.45rem',
                fontWeight: 800,
                color: '#fff',
                letterSpacing: '-0.02em',
                background: 'linear-gradient(135deg, #ffffff 40%, #e2e8f0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                ₹{product.price ? product.price.toLocaleString('en-IN') : 'Check Store'}
              </span>
            </div>

            {product.rating ? (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
                fontSize: '0.8rem',
                color: '#fbbf24',
                background: 'rgba(251, 191, 36, 0.1)',
                padding: '2px 6px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(251, 191, 36, 0.25)'
              }}>
                <Star size={12} fill="#fbbf24" />
                <span style={{ fontWeight: 800 }}>{product.rating}</span>
                {product.reviews ? (
                  <span style={{ color: 'var(--text-dim)', fontSize: '0.72rem' }}>({product.reviews})</span>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.6rem' }}>
          <a
            href={product.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.stopPropagation();
              onProductClick(product, 'buy_click');
            }}
            className="btn-primary"
            style={{
              flex: 1,
              justifyContent: 'center',
              padding: '0.55rem 0.85rem',
              fontSize: '0.82rem',
              textDecoration: 'none'
            }}
          >
            <ShoppingCart size={15} />
            <span>Buy Now</span>
          </a>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onViewHistory(product);
            }}
            className="btn-secondary"
            style={{ padding: '0.55rem 0.75rem' }}
            title="View Price Trend Analysis"
          >
            <LineChart size={16} color="var(--accent-cyan)" />
          </button>
        </div>
      </div>
    </div>
  );
}
