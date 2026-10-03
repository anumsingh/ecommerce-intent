import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import SearchHeader from './components/SearchHeader';
import IntentGauge from './components/IntentGauge';
import ComparisonHighlights from './components/ComparisonHighlights';
import PlatformColumns from './components/PlatformColumns';
import PriceHistoryModal from './components/PriceHistoryModal';
import PriceAlertModal from './components/PriceAlertModal';
import AuthModal from './components/AuthModal';
import WishlistDrawer from './components/WishlistDrawer';
import Toast from './components/Toast';
import SmoothLoader from './components/SmoothLoader';
import {
  searchProducts,
  trackIntentEvent,
  fetchCurrentIntent,
  resetIntentTracker,
  fetchWishlist,
  addToWishlist,
  removeFromWishlist,
  exportToExcel
} from './services/api';

const MAX_FREE_DEMO_SEARCHES = 2;

export default function App() {
  // User state
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('ecom_user_info');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Navigation View: 'home' (Landing page) or 'dashboard' (Live Comparison + ML Engine)
  const [currentView, setCurrentView] = useState(() => {
    try {
      const stored = localStorage.getItem('ecom_user_info');
      return stored ? 'dashboard' : 'home';
    } catch {
      return 'home';
    }
  });

  // Demo Searches Quota for Guests
  const [demoSearchesLeft, setDemoSearchesLeft] = useState(() => {
    const saved = sessionStorage.getItem('ecom_demo_searches');
    return saved !== null ? parseInt(saved, 10) : MAX_FREE_DEMO_SEARCHES;
  });

  // Core Data & Telemetry State
  const [toasts, setToasts] = useState([]);
  const [query, setQuery] = useState('Wireless Noise Cancelling Headphones');
  const [loading, setLoading] = useState(false);
  const [productsData, setProductsData] = useState(null);
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [intent, setIntent] = useState(null);
  const [isResettingIntent, setIsResettingIntent] = useState(false);
  const [showIntentPanel, setShowIntentPanel] = useState(true);

  // Modals
  const [historyProduct, setHistoryProduct] = useState(null);
  const [alertProduct, setAlertProduct] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // Wishlist
  const [wishlist, setWishlist] = useState([]);

  // Toast Helper
  const showToast = ({ type = 'success', title, message, duration = 4500 }) => {
    const id = 'toast_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    setToasts((prev) => [...prev, { id, type, title, message, duration }]);
  };

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // 1. Initial Load: Load intent & populate default wishlist
  useEffect(() => {
    fetchCurrentIntent().then((data) => {
      if (data) setIntent(data);
    }).catch(() => {});

    if (user?.email) {
      fetchWishlist(user.email).then((items) => setWishlist(items || []));
      handleSearch('Wireless Noise Cancelling Headphones', true);
    }
  }, []);

  // 2. Search Execution with Demo Limit Protection
  const handleSearch = async (searchQuery, isInitial = false) => {
    if (!searchQuery || !searchQuery.trim()) return;

    // Guest quota check
    if (!user && !isInitial) {
      if (demoSearchesLeft <= 0) {
        showToast({
          type: 'alert',
          title: 'Demo Search Limit Reached! 🔒',
          message: 'You have used all free demo searches. Please sign in or create an account to continue.'
        });
        setIsAuthOpen(true);
        return;
      }

      const nextQuota = demoSearchesLeft - 1;
      setDemoSearchesLeft(nextQuota);
      sessionStorage.setItem('ecom_demo_searches', nextQuota.toString());

      showToast({
        type: 'info',
        title: 'Demo Search Activated ⚡',
        message: `${nextQuota} free demo searches remaining. Sign in for unlimited live access.`
      });
    }

    // Switch to dashboard view to see live results & ML intent
    setCurrentView('dashboard');
    setLoading(true);
    setQuery(searchQuery);

    // Reset intent to baseline 0% on new search
    setIntent({
      purchase_probability: 0,
      score_pct: 0,
      level: 'Low',
      level_label: 'Casual Browsing',
      interaction_count: 0,
      session_duration_sec: 0,
      platforms_compared: 0,
      aspects: {
        exploration: 0,
        comparison: 0,
        commitment: 0,
        decision_focus: 0
      },
      insights: [`New search query "${searchQuery}" initiated. Start browsing products to predict intent.`]
    });

    try {
      const data = await searchProducts(searchQuery);
      setProductsData(data);
      if (data.intent) {
        setIntent(data.intent);
      }
    } catch (error) {
      console.error('Search failed:', error);
      showToast({
        type: 'error',
        title: 'Search Error',
        message: 'Could not fetch live merchant data. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  // 3. User Interaction Telemetry Tracking
  const handleProductInteraction = async (product, eventType = 'product_view') => {
    try {
      const updatedIntent = await trackIntentEvent(eventType, product.link || product.title, {
        title: product.title,
        price: product.price,
        platform: product.platform
      });
      if (updatedIntent) {
        setIntent(updatedIntent);
      }
    } catch (err) {
      console.error('Telemetry tracking failed:', err);
    }
  };

  // 4. Reset Intent Telemetry
  const handleResetIntent = async () => {
    setIsResettingIntent(true);
    try {
      const updatedIntent = await resetIntentTracker();
      setIntent(updatedIntent);
      showToast({
        type: 'info',
        title: 'Session Telemetry Reset 🔄',
        message: 'ML sequential purchase intent tracker reset to baseline 0%.'
      });
    } catch (err) {
      console.error('Reset failed:', err);
    } finally {
      setIsResettingIntent(false);
    }
  };

  // 5. Wishlist Management
  const handleToggleWishlist = async (product) => {
    if (!user) {
      showToast({
        type: 'info',
        title: 'Sign In Required 🔒',
        message: 'Please sign in or create an account to save items to your cloud wishlist.'
      });
      setIsAuthOpen(true);
      return;
    }

    const isSaved = wishlist.some(w => (w.productLink === product.link) || (w.productTitle === product.title));
    const userEmail = user.email;

    if (isSaved) {
      const item = wishlist.find(w => (w.productLink === product.link) || (w.productTitle === product.title));
      if (item) {
        await removeFromWishlist(item._id || item.productLink);
        setWishlist(prev => prev.filter(w => w !== item));
        showToast({
          type: 'wishlist',
          title: 'Removed from Wishlist',
          message: `${product.title.slice(0, 40)}... removed.`
        });
      }
    } else {
      const newItem = {
        userEmail,
        productTitle: product.title,
        productLink: product.link,
        price: product.price,
        rating: product.rating,
        reviews: product.reviews,
        image: product.image,
        platform: product.platform
      };
      await addToWishlist(newItem);
      setWishlist(prev => [newItem, ...prev]);
      showToast({
        type: 'wishlist',
        title: 'Saved to Wishlist! ❤️',
        message: `${product.title.slice(0, 45)}... saved on MongoDB Atlas.`
      });

      handleProductInteraction(product, 'wishlist_add');
    }
  };

  const handleRemoveWishlistItem = async (id) => {
    await removeFromWishlist(id);
    setWishlist(prev => prev.filter(w => (w._id !== id) && (w.productLink !== id)));
    showToast({
      type: 'wishlist',
      title: 'Removed from Wishlist',
      message: 'Product removed from your saved items.'
    });
  };

  // 6. Export to Excel
  const handleExport = async () => {
    if (productsData?.products) {
      await exportToExcel(productsData.products, query);
      showToast({
        type: 'success',
        title: 'Price Matrix Exported! 📊',
        message: `Excel spreadsheet for "${query}" downloaded successfully.`
      });
    }
  };

  // 7. Auth Handlers
  const handleAuthSuccess = (userData, actionType = 'login') => {
    setUser(userData);
    fetchWishlist(userData.email).then((items) => setWishlist(items || []));
    
    // Switch to live AI platform upon sign in/register
    setCurrentView('dashboard');

    if (actionType === 'register') {
      showToast({
        type: 'auth_register',
        title: 'Account Created Successfully! 🚀',
        message: `Welcome, ${userData.name}! Full AI Engine and unlimited searches unlocked.`
      });
    } else {
      showToast({
        type: 'auth_login',
        title: 'Welcome Back! 👋',
        message: `Logged in as ${userData.name} (${userData.email}). Unlimited access enabled.`
      });
    }

    // If no results loaded yet, load initial search
    if (!productsData) {
      handleSearch('Wireless Noise Cancelling Headphones', true);
    }
  };

  const handleLogout = () => {
    const userName = user?.name || 'User';
    localStorage.removeItem('ecom_auth_token');
    localStorage.removeItem('ecom_user_info');
    setUser(null);
    setCurrentView('home');
    showToast({
      type: 'auth_logout',
      title: 'Logged Out Successfully',
      message: `Goodbye, ${userName}! You have been securely signed out.`
    });
  };

  const wishlistMap = wishlist.reduce((acc, item) => {
    if (item.productLink) acc[item.productLink] = true;
    if (item.productTitle) acc[item.productTitle] = true;
    return acc;
  }, {});

  return (
    <div style={{ minHeight: '100vh', padding: '1.5rem 1rem 4rem 1rem' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Navigation Bar */}
        <Navbar
          user={user}
          onOpenAuth={() => setIsAuthOpen(true)}
          onLogout={handleLogout}
          onOpenWishlist={() => setIsWishlistOpen(true)}
          wishlistCount={wishlist.length}
          onToggleIntentPanel={() => setShowIntentPanel(prev => !prev)}
          showIntentPanel={showIntentPanel}
          onExport={handleExport}
          hasResults={Boolean(productsData?.products)}
          currentView={currentView}
          onNavigate={(view) => setCurrentView(view)}
          demoSearchesLeft={demoSearchesLeft}
        />

        {/* View 1: Landing / Home Page */}
        {currentView === 'home' && (
          <LandingPage
            onSearchDemo={(q) => handleSearch(q)}
            onOpenAuth={() => setIsAuthOpen(true)}
            demoSearchesLeft={demoSearchesLeft}
            onGoToDashboard={() => {
              setCurrentView('dashboard');
              if (!productsData) handleSearch('Wireless Noise Cancelling Headphones', true);
            }}
            isLoggedIn={Boolean(user)}
            userName={user?.name}
          />
        )}

        {/* View 2: Live AI Engine & Comparison Dashboard */}
        {currentView === 'dashboard' && (
          <>
            {/* Hero & Search Header */}
            <SearchHeader
              onSearch={handleSearch}
              loading={loading}
              currentQuery={query}
              selectedPlatform={selectedPlatform}
              onSelectPlatform={setSelectedPlatform}
            />

            {/* Real-Time Machine Learning Purchase Intent Gauge */}
            {showIntentPanel && (
              <IntentGauge
                intent={intent}
                onReset={handleResetIntent}
                isResetting={isResettingIntent}
              />
            )}

            {/* Smooth Cyber Multi-Store Loader */}
            {loading && <SmoothLoader query={query} />}

            {/* Smart Recommendations Section */}
            {!loading && productsData && (
              <ComparisonHighlights
                lowest={productsData.lowest}
                bestDeal={productsData.best_deal}
                bestSeller={productsData.best_seller}
                bestRated={productsData.best_rated}
                onProductClick={handleProductInteraction}
                onViewHistory={(p) => {
                  setHistoryProduct(p);
                  handleProductInteraction(p, 'history_view');
                }}
              />
            )}

            {/* Multi-Store Comparison Columns (Amazon, Myntra, Ajio) */}
            {!loading && productsData && (
              <PlatformColumns
                products={productsData.products}
                selectedPlatform={selectedPlatform}
                onProductClick={handleProductInteraction}
                onViewHistory={(p) => {
                  setHistoryProduct(p);
                  handleProductInteraction(p, 'history_view');
                }}
                onSetAlert={(p) => {
                  if (!user) {
                    showToast({
                      type: 'info',
                      title: 'Sign In Required 🔒',
                      message: 'Please sign in or register to arm price drop alerts.'
                    });
                    setIsAuthOpen(true);
                    return;
                  }
                  setAlertProduct(p);
                  handleProductInteraction(p, 'alert_intent');
                }}
                onToggleWishlist={handleToggleWishlist}
                wishlistMap={wishlistMap}
              />
            )}
          </>
        )}

        {/* Modals */}
        {historyProduct && (
          <PriceHistoryModal
            product={historyProduct}
            onClose={() => setHistoryProduct(null)}
          />
        )}

        {alertProduct && (
          <PriceAlertModal
            product={alertProduct}
            userEmail={user?.email}
            onClose={() => setAlertProduct(null)}
            onAlertSuccess={(msg) => {
              showToast({
                type: 'alert',
                title: 'Price Drop Alert Armed! 🔔',
                message: msg || `We will email you when the price drops below your target.`
              });
            }}
          />
        )}

        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          onAuthSuccess={handleAuthSuccess}
        />

        <WishlistDrawer
          isOpen={isWishlistOpen}
          onClose={() => setIsWishlistOpen(false)}
          items={wishlist}
          onRemove={handleRemoveWishlistItem}
          onProductClick={(item) => handleProductInteraction(item, 'buy_click')}
        />

        {/* Global Toast Alert Notifications */}
        <Toast toasts={toasts} onDismiss={dismissToast} />

        {/* Footer */}
        <footer style={{
          marginTop: '5rem',
          paddingTop: '2rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          fontSize: '0.82rem',
          color: 'var(--text-dim)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#10b981',
              boxShadow: '0 0 10px #10b981'
            }} />
            <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>
              Live Systems Operational: Amazon API • Myntra Scraping • Ajio Parser • LightGBM Model
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <span>MongoDB Atlas Connected</span>
            <span>•</span>
            <span>Microservice Port 5001</span>
            <span>•</span>
            <span style={{ color: '#818cf8', fontWeight: 700 }}>OmniPrice v2.0 AI Platform</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
