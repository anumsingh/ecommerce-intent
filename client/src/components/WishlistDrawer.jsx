import React from 'react';
import { X, Heart, Trash2, ExternalLink, ShoppingBag, ArrowRight } from 'lucide-react';

export default function WishlistDrawer({
  isOpen,
  onClose,
  items,
  onRemove,
  onProductClick
}) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(10px)',
      zIndex: 100,
      display: 'flex',
      justifyContent: 'flex-end'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '440px',
        height: '100%',
        borderRadius: 0,
        background: 'rgba(13, 18, 31, 0.95)',
        borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        padding: '1.75rem',
        boxShadow: '-20px 0 50px rgba(0, 0, 0, 0.8)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(244, 63, 94, 0.15)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Heart size={18} color="#f43f5e" fill="#f43f5e" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#fff' }}>
                Saved Wishlist
              </h3>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                {items.length} {items.length === 1 ? 'item saved' : 'items saved'}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: 'none',
              color: 'var(--text-muted)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.45rem',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Item List */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', paddingRight: '4px' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-dim)' }}>
              <ShoppingBag size={48} style={{ margin: '0 auto 1.25rem auto', opacity: 0.3, color: '#818cf8' }} />
              <p style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>Your wishlist is empty</p>
              <p style={{ fontSize: '0.82rem', marginTop: '0.4rem', color: 'var(--text-muted)' }}>
                Click the heart icon on any product to track it across stores.
              </p>
            </div>
          ) : (
            items.map((item, idx) => (
              <div
                key={item._id || item.productLink || idx}
                style={{
                  display: 'flex',
                  gap: '0.85rem',
                  padding: '0.85rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid var(--border-color)',
                  alignItems: 'center'
                }}
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.productTitle}
                    style={{
                      width: '50px',
                      height: '50px',
                      objectFit: 'contain',
                      background: 'rgba(255,255,255,0.05)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '2px'
                    }}
                  />
                )}

                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 style={{
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    margin: '0 0 0.25rem 0',
                    color: 'var(--text-main)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {item.productTitle}
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                      ₹{item.price ? item.price.toLocaleString('en-IN') : 'N/A'}
                    </span>
                    <span className={`badge badge-${item.platform || 'amazon'}`} style={{ fontSize: '0.65rem' }}>
                      {item.platform || 'Store'}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <a
                    href={item.productLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => onProductClick(item, 'buy_click')}
                    className="btn-primary"
                    style={{ padding: '0.35rem', borderRadius: 'var(--radius-sm)' }}
                    title="Open Store Link"
                  >
                    <ExternalLink size={14} />
                  </a>

                  <button
                    onClick={() => onRemove(item._id || item.productLink)}
                    style={{
                      background: 'rgba(244, 63, 94, 0.1)',
                      border: '1px solid rgba(244, 63, 94, 0.2)',
                      color: 'var(--accent-rose)',
                      padding: '0.35rem',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer'
                    }}
                    title="Remove item"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
