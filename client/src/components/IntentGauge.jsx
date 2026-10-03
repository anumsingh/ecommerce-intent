import React from 'react';
import {
  Brain,
  Activity,
  RefreshCw,
  Sparkles,
  Compass,
  GitCompare,
  HeartHandshake,
  Crosshair,
  TrendingUp,
  CheckCircle2,
  Clock,
  Layers,
  Store
} from 'lucide-react';

export default function IntentGauge({ intent, onReset, isResetting }) {
  if (!intent) {
    return (
      <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.5rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Initializing ML Purchase Intent Telemetry...
        </p>
      </div>
    );
  }

  // Raw probability & score percentage
  const rawProb = typeof intent.purchase_probability === 'number'
    ? intent.purchase_probability
    : (typeof intent.probability === 'number' ? intent.probability : 0);
  
  const probability = typeof intent.score_pct === 'number'
    ? intent.score_pct
    : Math.round(rawProb * 100);

  const level = intent.level || intent.intent_level || (probability >= 75 ? 'High' : probability >= 45 ? 'Moderate' : probability >= 20 ? 'Mild' : 'Low');
  const levelLabel = intent.level_label || (
    level === 'High' ? 'Ready to Purchase' :
    level === 'Moderate' ? 'Active Comparison' :
    level === 'Mild' ? 'Product Exploration' : 'Casual Browsing'
  );
  
  // Dynamic color palette based on intent level
  let color = 'var(--accent-emerald)';
  let bgGradient = 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(6, 182, 212, 0.1) 100%)';
  let badgeBorder = 'rgba(16, 185, 129, 0.4)';

  if (level === 'High' || level.toLowerCase() === 'high') {
    color = 'var(--accent-rose)';
    bgGradient = 'linear-gradient(135deg, rgba(244, 63, 94, 0.25) 0%, rgba(245, 158, 11, 0.15) 100%)';
    badgeBorder = 'rgba(244, 63, 94, 0.5)';
  } else if (level === 'Moderate' || level.toLowerCase() === 'moderate' || level === 'Medium') {
    color = 'var(--accent-amber)';
    bgGradient = 'linear-gradient(135deg, rgba(245, 158, 11, 0.22) 0%, rgba(99, 102, 241, 0.12) 100%)';
    badgeBorder = 'rgba(245, 158, 11, 0.45)';
  } else if (level === 'Mild' || level.toLowerCase() === 'mild') {
    color = '#06b6d4';
    bgGradient = 'linear-gradient(135deg, rgba(6, 182, 212, 0.2) 0%, rgba(99, 102, 241, 0.1) 100%)';
    badgeBorder = 'rgba(6, 182, 212, 0.4)';
  }

  const eventCount = intent.interaction_count ?? intent.session_events_count ?? 0;
  const platformsCompared = intent.platforms_compared ?? intent.features?.unique_items ?? 0;
  const durationSec = typeof intent.session_duration_sec === 'number'
    ? Math.round(intent.session_duration_sec)
    : Math.round(intent.features?.total_dwell_time || 0);
  
  const insights = Array.isArray(intent.insights) ? intent.insights : [];

  // Behavioral Aspects
  const aspects = intent.aspects || {
    exploration: Math.min(100, eventCount * 10),
    comparison: platformsCompared > 1 ? 60 : 20,
    commitment: 0,
    decision_focus: 15
  };

  const aspectCards = [
    {
      id: 'exploration',
      title: 'Exploration Depth',
      score: aspects.exploration || 0,
      icon: <Compass size={16} color="#38bdf8" />,
      color: '#38bdf8',
      desc: 'Catalog reach & dwell time',
      status: aspects.exploration >= 70 ? 'Deep Research' : aspects.exploration >= 35 ? 'Exploring' : 'Initial Scan'
    },
    {
      id: 'comparison',
      title: 'Price Comparison',
      score: aspects.comparison || 0,
      icon: <GitCompare size={16} color="#a855f7" />,
      color: '#a855f7',
      desc: 'Cross-store & price history checks',
      status: aspects.comparison >= 70 ? 'Extensive Cross-Check' : aspects.comparison >= 35 ? 'Benchmarking' : 'Single Store'
    },
    {
      id: 'commitment',
      title: 'Action Commitment',
      score: aspects.commitment || 0,
      icon: <HeartHandshake size={16} color="#f43f5e" />,
      color: '#f43f5e',
      desc: 'Wishlists, price drop alerts & clicks',
      status: aspects.commitment >= 70 ? 'High Buying Action' : aspects.commitment >= 30 ? 'Interested' : 'Passive Browsing'
    },
    {
      id: 'decision_focus',
      title: 'Decision Focus',
      score: aspects.decision_focus || 0,
      icon: <Crosshair size={16} color="#10b981" />,
      color: '#10b981',
      desc: 'Interaction cadence & consistency',
      status: aspects.decision_focus >= 70 ? 'Decisive Target' : aspects.decision_focus >= 35 ? 'Deliberate' : 'Casual Flow'
    }
  ];

  return (
    <div className="glass-panel" style={{
      padding: '1.65rem',
      marginBottom: '2rem',
      background: 'var(--gradient-card)',
      border: `1px solid ${color}40`,
      position: 'relative',
      overflow: 'hidden',
      transition: 'border-color 0.5s ease',
      boxShadow: `0 12px 36px -10px rgba(0, 0, 0, 0.6), 0 0 20px ${color}15`
    }}>
      {/* Background ambient glow */}
      <div style={{
        position: 'absolute',
        top: '-60px',
        right: '-60px',
        width: '240px',
        height: '240px',
        background: color,
        filter: 'blur(90px)',
        opacity: 0.22,
        pointerEvents: 'none',
        transition: 'background 0.5s ease'
      }} />

      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        gap: '0.85rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            padding: '0.55rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(99, 102, 241, 0.18)',
            border: '1px solid rgba(99, 102, 241, 0.35)',
            boxShadow: '0 0 15px rgba(99, 102, 241, 0.25)'
          }}>
            <Brain size={22} color="#818cf8" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, letterSpacing: '-0.01em' }}>
                Real-Time ML Purchase Intent Prediction Engine
              </h3>
              <span style={{
                fontSize: '0.65rem',
                padding: '0.15rem 0.5rem',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(129, 140, 248, 0.15)',
                color: '#818cf8',
                fontWeight: 700,
                border: '1px solid rgba(129, 140, 248, 0.3)'
              }}>
                v2.4 ENSEMBLE
              </span>
            </div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              LightGBM Sequential Tree Model • 4 Behavioral Dimensions • Dynamic Telemetry
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{
            fontSize: '0.82rem',
            padding: '0.4rem 0.95rem',
            borderRadius: 'var(--radius-full)',
            background: bgGradient,
            color: color,
            fontWeight: 800,
            border: `1px solid ${badgeBorder}`,
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            boxShadow: `0 0 16px ${color}35`,
            letterSpacing: '0.02em'
          }}>
            <Activity size={14} className="animate-pulse" />
            {level.toUpperCase()} INTENT: {levelLabel}
          </span>

          <button
            onClick={onReset}
            disabled={isResetting}
            className="btn-secondary"
            style={{ padding: '0.45rem 0.85rem', fontSize: '0.78rem', gap: '0.4rem' }}
            title="Reset Intent Telemetry back to 0%"
          >
            <RefreshCw size={13} className={isResetting ? 'animate-spin' : ''} />
            <span>Reset Telemetry</span>
          </button>
        </div>
      </div>

      {/* Main Score Bar & Quick Telemetry Metrics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(300px, 1.4fr) minmax(280px, 1fr)',
        gap: '1.25rem',
        marginBottom: '1.5rem',
        alignItems: 'stretch'
      }}>
        {/* Purchase Likelihood Progress Box */}
        <div style={{
          padding: '1.35rem',
          borderRadius: 'var(--radius-lg)',
          background: 'rgba(0, 0, 0, 0.35)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.65rem' }}>
              <div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  Composite Purchase Likelihood
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'block' }}>
                  Blended LightGBM Tree (40%) + Multi-Aspect Behavioral Heuristics (60%)
                </span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{
                  fontSize: '2.2rem',
                  fontWeight: 900,
                  color: color,
                  transition: 'color 0.3s ease',
                  letterSpacing: '-0.03em',
                  textShadow: `0 0 20px ${color}50`
                }}>
                  {probability}%
                </span>
              </div>
            </div>

            {/* Custom Multi-Tier Progress Track */}
            <div style={{
              width: '100%',
              height: '12px',
              background: 'rgba(255, 255, 255, 0.06)',
              borderRadius: 'var(--radius-full)',
              overflow: 'hidden',
              position: 'relative',
              marginBottom: '0.85rem',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <div style={{
                width: `${Math.min(100, Math.max(0, probability))}%`,
                height: '100%',
                background: `linear-gradient(90deg, #10b981 0%, #06b6d4 40%, #f59e0b 75%, ${color} 100%)`,
                borderRadius: 'var(--radius-full)',
                transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: `0 0 16px ${color}`
              }} />
            </div>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.72rem',
            color: 'var(--text-dim)',
            paddingTop: '0.35rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.04)'
          }}>
            <span style={{ color: probability < 20 ? 'var(--accent-emerald)' : 'inherit', fontWeight: probability < 20 ? 700 : 400 }}>
              0-19% Casual
            </span>
            <span style={{ color: probability >= 20 && probability < 45 ? '#06b6d4' : 'inherit', fontWeight: probability >= 20 && probability < 45 ? 700 : 400 }}>
              20-44% Exploring
            </span>
            <span style={{ color: probability >= 45 && probability < 75 ? 'var(--accent-amber)' : 'inherit', fontWeight: probability >= 45 && probability < 75 ? 700 : 400 }}>
              45-74% Comparing
            </span>
            <span style={{ color: probability >= 75 ? 'var(--accent-rose)' : 'inherit', fontWeight: probability >= 75 ? 700 : 400 }}>
              75-100% Ready to Buy
            </span>
          </div>
        </div>

        {/* Live Session Telemetry Badges */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0.75rem'
        }}>
          <div style={{
            padding: '1rem 0.75rem',
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center'
          }}>
            <Layers size={18} color="#818cf8" style={{ marginBottom: '0.35rem' }} />
            <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Session Events</span>
            <strong style={{ fontSize: '1.35rem', color: '#fff', fontWeight: 800 }}>{eventCount}</strong>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>touchpoints</span>
          </div>

          <div style={{
            padding: '1rem 0.75rem',
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center'
          }}>
            <Store size={18} color="#06b6d4" style={{ marginBottom: '0.35rem' }} />
            <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Stores Compared</span>
            <strong style={{ fontSize: '1.35rem', color: '#06b6d4', fontWeight: 800 }}>{platformsCompared}</strong>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>merchants</span>
          </div>

          <div style={{
            padding: '1rem 0.75rem',
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center'
          }}>
            <Clock size={18} color="#a855f7" style={{ marginBottom: '0.35rem' }} />
            <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Session Dwell</span>
            <strong style={{ fontSize: '1.35rem', color: '#a855f7', fontWeight: 800 }}>{durationSec}s</strong>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>active time</span>
          </div>
        </div>
      </div>

      {/* 4 Multi-Dimensional Behavioral Aspect Pillars */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '0.75rem'
        }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Behavioral Dimension Breakdown
          </span>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
            Evaluates 4 distinct intent signals in parallel
          </span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '0.85rem'
        }}>
          {aspectCards.map((aspect) => (
            <div
              key={aspect.id}
              style={{
                padding: '0.95rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(0, 0, 0, 0.25)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                      padding: '0.35rem',
                      borderRadius: 'var(--radius-sm)',
                      background: `${aspect.color}18`,
                      border: `1px solid ${aspect.color}35`
                    }}>
                      {aspect.icon}
                    </div>
                    <div>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff', display: 'block' }}>
                        {aspect.title}
                      </span>
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>
                        {aspect.desc}
                      </span>
                    </div>
                  </div>
                  <strong style={{ fontSize: '1rem', fontWeight: 800, color: aspect.color }}>
                    {aspect.score}%
                  </strong>
                </div>

                {/* Progress bar */}
                <div style={{
                  width: '100%',
                  height: '6px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  borderRadius: 'var(--radius-full)',
                  overflow: 'hidden',
                  margin: '0.5rem 0'
                }}>
                  <div style={{
                    width: `${Math.min(100, Math.max(0, aspect.score))}%`,
                    height: '100%',
                    background: aspect.color,
                    borderRadius: 'var(--radius-full)',
                    transition: 'width 0.5s ease',
                    boxShadow: `0 0 8px ${aspect.color}`
                  }} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.35rem' }}>
                <span style={{
                  fontSize: '0.68rem',
                  padding: '0.15rem 0.5rem',
                  borderRadius: 'var(--radius-full)',
                  background: `${aspect.color}15`,
                  color: aspect.color,
                  fontWeight: 600,
                  border: `1px solid ${aspect.color}30`
                }}>
                  {aspect.status}
                </span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>
                  Weight: {aspect.id === 'exploration' ? '20%' : aspect.id === 'comparison' ? '30%' : aspect.id === 'commitment' ? '35%' : '15%'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live AI Diagnostic Insights Feed */}
      {insights.length > 0 && (
        <div style={{
          padding: '0.85rem 1.15rem',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(255, 255, 255, 0.025)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.45rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: '#818cf8', fontWeight: 700 }}>
            <Sparkles size={15} color="#818cf8" />
            <span>AI Real-Time Behavioral Diagnostic Feed:</span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {insights.map((insight, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.5rem',
                fontSize: '0.78rem',
                color: 'var(--text-muted)',
                lineHeight: 1.4
              }}>
                <CheckCircle2 size={13} color="var(--accent-emerald)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{insight}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
