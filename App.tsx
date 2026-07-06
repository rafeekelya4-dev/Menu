import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

// ProtectedRoute component to secure backoffice console
interface ProtectedRouteProps {
  isAuthenticated: boolean;
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ isAuthenticated, children }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};
import {
  Search,
  Heart,
  ShoppingBag,
  Star,
  Clock,
  Info,
  MapPin,
  ChevronDown,
  Sparkles,
  UtensilsCrossed,
  PhoneCall,
  BellRing,
  HelpCircle,
  Settings
} from 'lucide-react';

// Type declarations & dummy initializers
import { Product, Review, Offer, RestaurantInfo, CartItem, RestaurantStatus, Order, Coupon, Employee, CustomerCRM } from './types';
import {
  CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_REVIEWS,
  INITIAL_OFFERS,
  RESTAURANT_INFO
} from './data';

// Components
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { EmptyState } from './components/EmptyState';
import { ErrorScreen } from './components/ErrorScreen';
import { SaaSController } from './components/SaaSController';
import { ReviewsSection } from './components/ReviewsSection';
import { OffersCarousel } from './components/OffersCarousel';
import { RestaurantMap } from './components/RestaurantMap';
import { OrderStatusTracker } from './components/OrderStatusTracker';

// SaaS Core Imports
import { AppLayout } from './layouts/AppLayout';
import { BackofficeConsole } from './features/backoffice/BackofficeConsole';
import { AdminLogin } from './features/backoffice/AdminLogin';
import { ToastContainer, ToastItem } from './components/ui/Toast';
import { INITIAL_COUPONS, INITIAL_EMPLOYEES, INITIAL_CUSTOMERS, getInitialOrders } from './services/saasService';

// Firebase Integrations
import { seedDatabase, dbService, isCollectionEmpty } from './lib/firebase';
import { ADDONS_LIST } from './components/ProductDetailModal';

export default function App() {
  const navigate = useNavigate();

  // 1. Core Enterprise States synced with localStorage & Firestore
  const [products, rawSetProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('les_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('les_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('les_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [appliedCode, setAppliedCode] = useState<string | null>(() => {
    return localStorage.getItem('les_promo_code');
  });

  const [restaurantStatus, setRestaurantStatus] = useState<RestaurantStatus>(() => {
    const saved = localStorage.getItem('les_rest_status');
    return (saved as RestaurantStatus) || 'open';
  });

  // Additional Backoffice Module Bindings
  const [reviews, rawSetReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('les_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [offers, rawSetOffers] = useState<Offer[]>(() => {
    const saved = localStorage.getItem('les_offers');
    return saved ? JSON.parse(saved) : INITIAL_OFFERS;
  });

  const [restaurantInfo, rawSetRestaurantInfo] = useState<RestaurantInfo>(() => {
    const saved = localStorage.getItem('les_rest_info');
    return saved ? JSON.parse(saved) : RESTAURANT_INFO;
  });

  const [orders, rawSetOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('les_orders');
    return saved ? JSON.parse(saved) : getInitialOrders(INITIAL_PRODUCTS);
  });

  const [coupons, rawSetCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('les_coupons');
    return saved ? JSON.parse(saved) : INITIAL_COUPONS;
  });

  const [employees, rawSetEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('les_employees');
    return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
  });

  const [customers, rawSetCustomers] = useState<CustomerCRM[]>(() => {
    const saved = localStorage.getItem('les_customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  // Wrapped Setters for Two-way Firestore Synchronization
  const setProducts: React.Dispatch<React.SetStateAction<Product[]>> = (value) => {
    rawSetProducts((prev) => {
      const next = typeof value === 'function' ? value(prev) : value;
      if (next.length < prev.length) {
        const deleted = prev.filter(p => !next.some(n => n.id === p.id));
        deleted.forEach(p => dbService.deleteProduct(p.id));
      } else {
        next.forEach(p => {
          const old = prev.find(o => o.id === p.id);
          if (!old || JSON.stringify(old) !== JSON.stringify(p)) {
            dbService.saveProduct(p);
          }
        });
      }
      return next;
    });
  };

  const setReviews: React.Dispatch<React.SetStateAction<Review[]>> = (value) => {
    rawSetReviews((prev) => {
      const next = typeof value === 'function' ? value(prev) : value;
      next.forEach(r => {
        const old = prev.find(oldRev => oldRev.id === r.id);
        if (!old || JSON.stringify(old) !== JSON.stringify(r)) {
          dbService.saveReview(r);
        }
      });
      return next;
    });
  };

  const setOffers: React.Dispatch<React.SetStateAction<Offer[]>> = (value) => {
    rawSetOffers((prev) => {
      const next = typeof value === 'function' ? value(prev) : value;
      next.forEach(o => {
        const old = prev.find(oldOffer => oldOffer.id === o.id);
        if (!old || JSON.stringify(old) !== JSON.stringify(o)) {
          dbService.saveOffer(o);
        }
      });
      return next;
    });
  };

  const setRestaurantInfo: React.Dispatch<React.SetStateAction<RestaurantInfo>> = (value) => {
    rawSetRestaurantInfo((prev) => {
      const next = typeof value === 'function' ? value(prev) : value;
      if (JSON.stringify(prev) !== JSON.stringify(next)) {
        dbService.saveRestaurantInfo(next);
      }
      return next;
    });
  };

  const setOrders: React.Dispatch<React.SetStateAction<Order[]>> = (value) => {
    rawSetOrders((prev) => {
      const next = typeof value === 'function' ? value(prev) : value;
      next.forEach(o => {
        const old = prev.find(oldOrder => oldOrder.id === o.id);
        if (!old || JSON.stringify(old) !== JSON.stringify(o)) {
          dbService.saveOrder(o);
        }
      });
      return next;
    });
  };

  const setCoupons: React.Dispatch<React.SetStateAction<Coupon[]>> = (value) => {
    rawSetCoupons((prev) => {
      const next = typeof value === 'function' ? value(prev) : value;
      next.forEach(c => {
        const old = prev.find(oldCoupon => oldCoupon.id === c.id);
        if (!old || JSON.stringify(old) !== JSON.stringify(c)) {
          dbService.saveCoupon(c);
        }
      });
      return next;
    });
  };

  const setEmployees: React.Dispatch<React.SetStateAction<Employee[]>> = (value) => {
    rawSetEmployees((prev) => {
      const next = typeof value === 'function' ? value(prev) : value;
      next.forEach(e => {
        const old = prev.find(oldEmp => oldEmp.id === e.id);
        if (!old || JSON.stringify(old) !== JSON.stringify(e)) {
          dbService.saveEmployee(e);
        }
      });
      return next;
    });
  };

  const setCustomers: React.Dispatch<React.SetStateAction<CustomerCRM[]>> = (value) => {
    rawSetCustomers((prev) => {
      const next = typeof value === 'function' ? value(prev) : value;
      next.forEach(c => {
        const old = prev.find(oldCust => oldCust.id === c.id);
        if (!old || JSON.stringify(old) !== JSON.stringify(c)) {
          dbService.saveCustomer(c);
        }
      });
      return next;
    });
  };

  // Real Database Sync Effect with Auto-seeding
  useEffect(() => {
    let active = true;
    const unsubscribes: (() => void)[] = [];

    async function initFirebaseAndSync() {
      try {
        // Check if products collection is empty
        const emptyCheck = await isCollectionEmpty('products');
        if (!active) return;

        if (emptyCheck) {
          console.log('Database empty. Seeding initial data...');
          await seedDatabase({
            products: INITIAL_PRODUCTS,
            categories: CATEGORIES,
            addons: ADDONS_LIST,
            reviews: INITIAL_REVIEWS,
            offers: INITIAL_OFFERS,
            coupons: INITIAL_COUPONS,
            employees: INITIAL_EMPLOYEES,
            customers: INITIAL_CUSTOMERS,
            restaurantInfo: RESTAURANT_INFO
          });
        }

        if (!active) return;

        // Dynamic Real-time subscriptions
        const unsubProducts = dbService.subscribeProducts((items) => {
          if (active) {
            rawSetProducts(items);
            // Auto-sync missing menu products from INITIAL_PRODUCTS to Firestore
            const missing = INITIAL_PRODUCTS.filter(ip => !items.some(item => item.id === ip.id));
            if (missing.length > 0) {
              console.log('Syncing newly extracted menu products to database:', missing.map(p => p.name));
              missing.forEach(p => {
                dbService.saveProduct(p);
              });
            }
          }
        });
        unsubscribes.push(unsubProducts);

        const unsubRestInfo = dbService.subscribeRestaurantInfo((info) => {
          if (active && info) rawSetRestaurantInfo(info);
        });
        unsubscribes.push(unsubRestInfo);

        const unsubOrders = dbService.subscribeOrders((items) => {
          if (active) rawSetOrders(items);
        });
        unsubscribes.push(unsubOrders);

        const unsubCoupons = dbService.subscribeCoupons((items) => {
          if (active) rawSetCoupons(items);
        });
        unsubscribes.push(unsubCoupons);

        const unsubEmployees = dbService.subscribeEmployees((items) => {
          if (active) rawSetEmployees(items);
        });
        unsubscribes.push(unsubEmployees);

        const unsubCustomers = dbService.subscribeCustomers((items) => {
          if (active) rawSetCustomers(items);
        });
        unsubscribes.push(unsubCustomers);

        const unsubReviews = dbService.subscribeReviews((items) => {
          if (active) rawSetReviews(items);
        });
        unsubscribes.push(unsubReviews);

        const unsubOffers = dbService.subscribeOffers((items) => {
          if (active) rawSetOffers(items);
        });
        unsubscribes.push(unsubOffers);

      } catch (err) {
        console.error('Firebase initialization or sync error:', err);
        addToast('L’Étoile local caching enabled (offline).', 'info');
      }
    }

    initFirebaseAndSync();

    return () => {
      active = false;
      unsubscribes.forEach((unsub) => {
        try {
          unsub();
        } catch (e) {
          console.error('Error cleaning up subscription:', e);
        }
      });
    };
  }, []);

  const [activeAccentColor, setActiveAccentColor] = useState<string>(() => {
    return localStorage.getItem('les_accent_color') || 'amber';
  });

  // Toast System
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = (message: string, type: 'success' | 'warning' | 'error' | 'info' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Connection Simulation & Skeletons
  const [isOffline, setIsOffline] = useState(false);
  const [isLoadingSkeleton, setIsLoadingSkeleton] = useState(false);
  const [isSimOpen, setIsSimOpen] = useState(true);

  // UI state variables
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewingFavoritesOnly, setViewingFavoritesOnly] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isHoursModalOpen, setIsHoursModalOpen] = useState(false);

  // SaaS frontend navigation state (Extended to include backoffice admin and real-time tracker)
  const [activeMainTab, setActiveMainTab] = useState<'menu' | 'profile' | 'backoffice' | 'track-order'>('menu');
  const [curationFilter, setCurationFilter] = useState<'all' | 'featured' | 'bestseller' | 'recommended' | 'new' | 'popular'>('all');

  // Admin Authentication State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('les_admin_authenticated') === 'true';
  });

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem('les_admin_authenticated');
    addToast('Admin session terminated successfully.', 'info');
  };

  const handleHeaderSearchClick = () => {
    setActiveMainTab('menu');
    setViewingFavoritesOnly(false);
    setTimeout(() => {
      const searchInput = document.getElementById('main-search-input');
      if (searchInput) {
        searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        searchInput.focus();
      } else {
        const menuSection = document.getElementById('gourmet-menu-section');
        if (menuSection) {
          menuSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }, 100);
  };


  const handleAdminLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    localStorage.setItem('les_admin_authenticated', 'true');
  };

  // Synchronize state based on the current routing path
  useEffect(() => {
    if (window.location.pathname === '/' && activeMainTab === 'backoffice') {
      setActiveMainTab('menu');
    }
  }, [activeMainTab]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('les_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('les_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('les_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (appliedCode) {
      localStorage.setItem('les_promo_code', appliedCode);
    } else {
      localStorage.removeItem('les_promo_code');
    }
  }, [appliedCode]);

  useEffect(() => {
    localStorage.setItem('les_rest_status', restaurantStatus);
  }, [restaurantStatus]);

  useEffect(() => {
    localStorage.setItem('les_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('les_offers', JSON.stringify(offers));
  }, [offers]);

  useEffect(() => {
    localStorage.setItem('les_rest_info', JSON.stringify(restaurantInfo));
  }, [restaurantInfo]);

  useEffect(() => {
    localStorage.setItem('les_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('les_coupons', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem('les_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('les_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('les_accent_color', activeAccentColor);
  }, [activeAccentColor]);

  // Handle Favorites toggle
  const handleToggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering card selection
    const isFav = favorites.includes(id);
    setFavorites((prev) =>
      isFav ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
    const targetProduct = products.find(p => p.id === id);
    if (targetProduct) {
      if (!isFav) {
        addToast(`"${targetProduct.name}" bookmarked to favorites!`, 'success');
      } else {
        addToast(`"${targetProduct.name}" removed from favorites`, 'info');
      }
    }
  };

  // Add to cart
  const handleAddToCart = (
    product: Product,
    quantity: number = 1,
    notes: string = '',
    selectedAddons: { id: string; name: string; price: number; }[] = []
  ) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => {
        if (item.product.id !== product.id) return false;
        if ((item.notes || '') !== notes) return false;
        
        const itemAddons = item.selectedAddons || [];
        if (itemAddons.length !== selectedAddons.length) return false;
        const itemAddonIds = itemAddons.map((a) => a.id).sort().join(',');
        const targetAddonIds = selectedAddons.map((a) => a.id).sort().join(',');
        return itemAddonIds === targetAddonIds;
      });

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        addToast(`Updated "${product.name}" quantity to ${updated[existingIndex].quantity}`, 'success');
        return updated;
      } else {
        addToast(`"${product.name}" added to gourmet basket!`, 'success');
        const uniqueId = `${product.id}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
        return [...prev, { id: uniqueId, product, quantity, notes, selectedAddons }];
      }
    });
  };

  const handleUpdateCartQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(id);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        (item.id === id || item.product.id === id) ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveFromCart = (id: string) => {
    const item = cart.find(c => c.id === id || c.product.id === id);
    if (item) {
      addToast(`"${item.product.name}" removed from basket`, 'info');
    }
    setCart((prev) => prev.filter((item) => item.id !== id && item.product.id !== id));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Live order place action
  const handlePlaceOrder = (
    items: CartItem[],
    subtotal: number,
    discount: number,
    deliveryFee: number,
    tipAmount: number,
    total: number
  ) => {
    const newOrderId = `order-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      id: newOrderId,
      customerName: 'Anonymous Private Estate',
      items: items.map(item => ({
        product: item.product,
        quantity: item.quantity,
        notes: item.notes
      })),
      subtotal,
      deliveryFee,
      tipAmount,
      discount,
      total,
      status: 'pending',
      timestamp: new Date().toISOString(),
      address: restaurantInfo.address || '740 Park Avenue, Apt 14B, New York, NY'
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Track CRM transaction
    const updatedCustomers = [...customers];
    const guestIndex = updatedCustomers.findIndex(c => c.name === 'Anonymous Private Estate');
    if (guestIndex > -1) {
      updatedCustomers[guestIndex].ordersCount += 1;
      updatedCustomers[guestIndex].totalSpent += total;
    } else {
      updatedCustomers.push({
        id: `crm-${Date.now()}`,
        name: 'Anonymous Private Estate',
        email: 'estate@parkavenue-private.co',
        ordersCount: 1,
        totalSpent: total,
        joinDate: new Date().toISOString().split('T')[0]
      });
    }
    setCustomers(updatedCustomers);

    // Save order tracking info locally
    localStorage.setItem('les_last_placed_order_id', newOrderId);
    const existingRaw = localStorage.getItem('les_my_orders');
    let myOrdersList: string[] = [];
    if (existingRaw) {
      try {
        myOrdersList = JSON.parse(existingRaw);
      } catch (e) {}
    }
    if (!myOrdersList.includes(newOrderId)) {
      myOrdersList = [newOrderId, ...myOrdersList].slice(0, 5);
      localStorage.setItem('les_my_orders', JSON.stringify(myOrdersList));
    }

    addToast(`Order placed successfully! Generated live ticket: ${newOrderId}`, 'success');
    addToast('Navigating to real-time order status tracker...', 'info');

    // Redirect to real-time order status tracking
    setActiveMainTab('track-order');
  };

  const handleGlobalHelpfulClick = (reviewId: string) => {
    setReviews(prev =>
      prev.map(r => r.id === reviewId ? { ...r, helpfulCount: (r.helpfulCount || 0) + 1 } : r)
    );
    addToast('Thank you for your review feedback!', 'info');
  };

  const handleRetryConnection = async () => {
    setIsOffline(false);
    addToast('Reconnected to L’Étoile servers', 'success');
  };

  const handleBentoClick = (type: 'reviews' | 'map' | 'schedule' | 'bestseller') => {
    if (type === 'reviews') {
      const reviewsSection = document.getElementById('customer-reviews-section');
      if (reviewsSection) {
        reviewsSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (type === 'map') {
      setActiveMainTab('profile');
      setTimeout(() => {
        const mapSection = document.getElementById('dispatch-map-container');
        if (mapSection) {
          mapSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    } else if (type === 'schedule') {
      setIsHoursModalOpen(true);
    } else if (type === 'bestseller') {
      const bestseller = products.find(p => p.isBestseller) || products[0];
      setSelectedProduct(bestseller);
    }
  };

  // Filtering products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesFavorites = !viewingFavoritesOnly || favorites.includes(p.id);

    const matchesCuration =
      curationFilter === 'all' ||
      (curationFilter === 'featured' && p.isFeatured) ||
      (curationFilter === 'bestseller' && p.isBestseller) ||
      (curationFilter === 'recommended' && p.isChefRecommended) ||
      (curationFilter === 'new' && p.isNewArrival) ||
      (curationFilter === 'popular' && p.isPopularThisWeek);

    return matchesSearch && matchesCategory && matchesFavorites && matchesCuration;
  });

  const favoritesCount = favorites.length;
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const getStatusConfig = () => {
    switch (restaurantStatus) {
      case 'busy':
        return {
          text: 'Busy / High Occupancy',
          colorClass: 'bg-amber-500 text-white',
          dot: '🟠',
          desc: 'Kitchen is currently running at high demand. Prep times +10 min.'
        };
      case 'closed':
        return {
          text: 'Closed for Prep',
          colorClass: 'bg-rose-500 text-white',
          dot: '🔴',
          desc: 'We are currently offline preparing gourmet batches. Check schedules.'
        };
      case 'open':
      default:
        return {
          text: 'Open Now',
          colorClass: 'bg-emerald-500 text-white',
          dot: '🟢',
          desc: 'Accepting premium orders for instant high-speed delivery.'
        };
    }
  };

  const statusConfig = getStatusConfig();

  // Color mappings based on dynamic selection
  const accentColorClasses = {
    amber: 'text-amber-400 border-amber-400 bg-amber-500 hover:bg-amber-400 focus:ring-amber-400',
    indigo: 'text-indigo-400 border-indigo-400 bg-indigo-600 hover:bg-indigo-500 focus:ring-indigo-500',
    emerald: 'text-emerald-400 border-emerald-400 bg-emerald-500 hover:bg-emerald-400 focus:ring-emerald-400',
    rose: 'text-rose-400 border-rose-400 bg-rose-600 hover:bg-rose-500 focus:ring-rose-500',
    purple: 'text-purple-400 border-purple-400 bg-purple-600 hover:bg-purple-500 focus:ring-purple-500'
  };

  const accentStyles = accentColorClasses[activeAccentColor as keyof typeof accentColorClasses] || accentColorClasses.amber;

  return (
    <AppLayout activeAccentColor={activeAccentColor}>
      {/* SaaS Simulation Controls Overlay */}
      <SaaSController
        status={restaurantStatus}
        setStatus={setRestaurantStatus}
        isOffline={isOffline}
        setIsOffline={setIsOffline}
        isLoadingSkeleton={isLoadingSkeleton}
        setIsLoadingSkeleton={setIsLoadingSkeleton}
        isOpen={isSimOpen}
        setIsOpen={setIsSimOpen}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <Routes>
        <Route
          path="/login"
          element={
            isAdminAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <div className="py-6 px-4 md:px-8">
                <AdminLogin
                  onLoginSuccess={handleAdminLoginSuccess}
                  addToast={addToast}
                />
              </div>
            )
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isAuthenticated={isAdminAuthenticated}>
              <div className="py-6 px-4 md:px-8">
                <BackofficeConsole
                  products={products}
                  setProducts={setProducts}
                  reviews={reviews}
                  setReviews={setReviews}
                  offers={offers}
                  setOffers={setOffers}
                  restaurantInfo={restaurantInfo}
                  setRestaurantInfo={setRestaurantInfo}
                  orders={orders}
                  setOrders={setOrders}
                  coupons={coupons}
                  setCoupons={setCoupons}
                  employees={employees}
                  setEmployees={setEmployees}
                  customers={customers}
                  setCustomers={setCustomers}
                  activeAccentColor={activeAccentColor}
                  setActiveAccentColor={setActiveAccentColor}
                  addToast={addToast}
                  onLogout={handleAdminLogout}
                />
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/"
          element={
            <AnimatePresence mode="wait">
              {isOffline ? (
                <motion.div
                  key="offline-screen"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <ErrorScreen type="offline" onRetry={handleRetryConnection} />
                </motion.div>
              ) : (
                <motion.div
                  key="app-content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
             {/* Navigation Header */}
             <header className="sticky top-0 z-40 bg-white border-b border-slate-100 px-4 py-3 md:px-8 transition-all duration-300 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
               <div className="max-w-7xl mx-auto flex items-center justify-between">
                 {/* Brand Logo and Name */}
                 <div className="flex items-center gap-3">
                   <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 shrink-0 flex items-center justify-center shadow-xs">
                     <img
                       src={restaurantInfo.logo}
                       alt={restaurantInfo.name}
                       className="w-full h-full object-cover"
                       onError={(e) => {
                         // Fallback icon
                         e.currentTarget.style.display = 'none';
                       }}
                     />
                     <UtensilsCrossed className="w-5 h-5 text-orange-600 absolute animate-pulse" />
                   </div>
                   <div>
                     <h1 className="font-sans font-bold text-slate-900 tracking-tight text-sm md:text-base leading-none">
                       {restaurantInfo.name}
                     </h1>
                     <div className="flex items-center gap-1.5 mt-1">
                       <span className="flex h-1.5 w-1.5 relative">
                         <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                           restaurantStatus === 'open' ? 'bg-emerald-400' : restaurantStatus === 'busy' ? 'bg-amber-400' : 'bg-rose-400'
                         }`} />
                         <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${
                           restaurantStatus === 'open' ? 'bg-emerald-500' : restaurantStatus === 'busy' ? 'bg-amber-500' : 'bg-rose-500'
                         }`} />
                       </span>
                       <button
                         onClick={() => setIsHoursModalOpen(true)}
                         className="text-[9px] font-bold uppercase tracking-wider text-slate-450 hover:text-orange-600 flex items-center gap-0.5 transition-colors cursor-pointer"
                       >
                         {statusConfig.text}
                         <ChevronDown className="w-3 h-3 text-orange-500" />
                       </button>
                     </div>
                   </div>
                 </div>

                 {/* Main Experience Tab Selector */}
                 <div className="hidden md:flex items-center bg-slate-50 border border-slate-100 p-1 rounded-full">
                   <button
                     onClick={() => {
                       setActiveMainTab('menu');
                       setViewingFavoritesOnly(false);
                     }}
                     className={`px-5 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                       activeMainTab === 'menu' && !viewingFavoritesOnly
                         ? 'bg-orange-600 text-white shadow-sm font-extrabold'
                         : 'text-slate-600 hover:text-slate-900'
                     }`}
                   >
                     Culinary Menu
                    </button>
                    <button
                      onClick={() => {
                        setActiveMainTab('profile');
                        setViewingFavoritesOnly(false);
                      }}
                      className={`px-5 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                        activeMainTab === 'profile'
                          ? 'bg-orange-600 text-white shadow-sm font-extrabold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      L'Étoile Profile
                    </button>
                    <button
                      onClick={() => {
                        setActiveMainTab('track-order');
                        setViewingFavoritesOnly(false);
                      }}
                      className={`px-5 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                        activeMainTab === 'track-order'
                          ? 'bg-orange-600 text-white shadow-sm font-extrabold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Track Order
                    </button>

                   <button
                     onClick={() => {
                       navigate('/dashboard');
                     }}
                     className="px-4 py-2 rounded-full text-xs font-black transition-all duration-200 cursor-pointer flex items-center gap-1.5 text-orange-600 hover:text-orange-700 ml-1 bg-orange-50/50 hover:bg-orange-50 border border-orange-100/60"
                   >
                     <Settings className="w-3.5 h-3.5" />
                     Console
                   </button>
                 </div>

                 {/* Header Actions */}
                 <div className="flex items-center gap-2">
                   {/* Search trigger icon */}
                   <button
                     onClick={handleHeaderSearchClick}
                     className="p-2.5 rounded-full bg-slate-50 border border-slate-100 text-slate-550 hover:text-slate-900 hover:bg-slate-100 transition-all cursor-pointer min-h-[38px] min-w-[38px] md:min-h-[40px] md:min-w-[40px] flex items-center justify-center hover:scale-105 active:scale-95"
                     title="Search menu..."
                   >
                     <Search className="w-4 h-4" />
                   </button>

                   <button
                     onClick={() => {
                       setViewingFavoritesOnly((prev) => !prev);
                       setActiveMainTab('menu');
                     }}
                     className={`p-2.5 rounded-full border transition-all cursor-pointer min-h-[38px] min-w-[38px] md:min-h-[40px] md:min-w-[40px] flex items-center justify-center relative ${
                       viewingFavoritesOnly
                         ? 'bg-rose-50 border-rose-100 text-rose-600'
                         : 'bg-slate-50 border-slate-100 text-slate-550 hover:text-slate-900 hover:bg-slate-100'
                     }`}
                     title="Show Saved Favorites"
                   >
                     <Heart className={`w-4 h-4 ${viewingFavoritesOnly ? 'fill-rose-500 text-rose-500' : ''}`} />
                     {favoritesCount > 0 && (
                       <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-bold font-mono h-4.5 w-4.5 rounded-full flex items-center justify-center border-2 border-white animate-bounce">
                         {favoritesCount}
                       </span>
                     )}
                   </button>

                   <button
                     onClick={() => setIsCartOpen(true)}
                     className="p-2.5 rounded-full bg-orange-600 border border-transparent text-white hover:bg-orange-700 transition-all cursor-pointer min-h-[38px] min-w-[38px] md:min-h-[40px] md:min-w-[40px] flex items-center justify-center relative shadow-sm hover:shadow-md hover:scale-105 active:scale-95"
                     title="Open culinary basket"
                   >
                     <ShoppingBag className="w-4.5 h-4.5 text-white" />
                     {cartItemCount > 0 && (
                       <span className="absolute -top-1 -right-1 bg-slate-950 text-white text-[9px] font-bold font-mono h-4.5 w-4.5 rounded-full flex items-center justify-center border-2 border-white">
                         {cartItemCount}
                       </span>
                     )}
                   </button>
                 </div>
               </div>
             </header>

             {/* Mobile Navigation Tabs */}
              <div className="flex md:hidden bg-white/95 border-b border-slate-200/80 p-1 px-4 sticky top-[72px] z-30 justify-between items-center backdrop-blur-xl shadow-xs">
                <button
                  onClick={() => {
                    setActiveMainTab('menu');
                    setViewingFavoritesOnly(false);
                  }}
                  className={`flex-1 py-3 text-center text-xs font-black border-b-2 transition-all duration-300 ${
                    activeMainTab === 'menu' && !viewingFavoritesOnly ? 'border-orange-600 text-orange-600' : 'border-transparent text-slate-500'
                  }`}
                >
                  Menu
                </button>
                <button
                  onClick={() => {
                    setActiveMainTab('profile');
                    setViewingFavoritesOnly(false);
                  }}
                  className={`flex-1 py-3 text-center text-xs font-black border-b-2 transition-all duration-300 ${
                    activeMainTab === 'profile' ? 'border-orange-600 text-orange-600' : 'border-transparent text-slate-500'
                  }`}
                >
                  Profile
                </button>
                <button
                  onClick={() => {
                    setActiveMainTab('track-order');
                    setViewingFavoritesOnly(false);
                  }}
                  className={`flex-1 py-3 text-center text-xs font-black border-b-2 transition-all duration-300 ${
                    activeMainTab === 'track-order' ? 'border-orange-600 text-orange-600' : 'border-transparent text-slate-500'
                  }`}
                >
                  Track
                </button>
                <button
                  onClick={() => {
                    navigate('/dashboard');
                  }}
                  className="flex-1 py-3 text-center text-xs font-black border-b-2 transition-all flex items-center justify-center gap-1 border-transparent text-slate-500"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-400" />
                  Console
                </button>
              </div>

             {/* Restaurant Hours Overlay Modal */}
            <AnimatePresence>
              {isHoursModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 max-w-sm w-full relative text-slate-800"
                  >
                    <button
                      onClick={() => setIsHoursModalOpen(false)}
                      className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 cursor-pointer font-bold"
                    >
                      ✕
                    </button>

                    <div className="text-center mb-5">
                      <div className="inline-flex p-3 rounded-2xl bg-orange-100/50 border border-orange-200 text-orange-600 mb-3">
                        <Clock className="w-6 h-6 animate-pulse" />
                      </div>
                      <h3 className="font-display font-black text-slate-950 text-lg">
                        {restaurantInfo.name} Schedule
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">{restaurantInfo.address}</p>
                    </div>

                    <div className="space-y-2.5 mb-5">
                      {restaurantInfo.hours.map((h, i) => (
                        <div key={i} className="flex justify-between items-center text-xs border-b border-slate-100 pb-2 last:border-0 last:pb-0">
                          <span className="font-bold text-slate-750">{h.days}</span>
                          <span className="text-orange-600 font-mono font-bold">{h.time}</span>
                        </div>
                      ))}
                    </div>

                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 text-xs text-slate-600 leading-relaxed text-center">
                      <span className="font-black text-slate-950 block mb-1">Status: {statusConfig.text}</span>
                      {statusConfig.desc}
                    </div>

                    <button
                      onClick={() => setIsHoursModalOpen(false)}
                      className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-full text-xs font-bold cursor-pointer transition-colors mt-3 shadow-xs"
                    >
                      Acknowledge Schedule
                    </button>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {activeMainTab === 'backoffice' ? (
                !isAdminAuthenticated ? (
                  <motion.div
                    key="admin-login-tab"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="py-6 px-4 md:px-8"
                  >
                    <AdminLogin
                      onLoginSuccess={handleAdminLoginSuccess}
                      addToast={addToast}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="backoffice-tab"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                    className="py-6 px-4 md:px-8"
                  >
                    <BackofficeConsole
                      products={products}
                      setProducts={setProducts}
                      reviews={reviews}
                      setReviews={setReviews}
                      offers={offers}
                      setOffers={setOffers}
                      restaurantInfo={restaurantInfo}
                      setRestaurantInfo={setRestaurantInfo}
                      orders={orders}
                      setOrders={setOrders}
                      coupons={coupons}
                      setCoupons={setCoupons}
                      employees={employees}
                      setEmployees={setEmployees}
                      customers={customers}
                      setCustomers={setCustomers}
                      activeAccentColor={activeAccentColor}
                      setActiveAccentColor={setActiveAccentColor}
                      addToast={addToast}
                      onLogout={handleAdminLogout}
                    />
                  </motion.div>
                )
              ) : activeMainTab === 'track-order' ? (
                <motion.div
                  key="track-order-view"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35 }}
                >
                  <OrderStatusTracker
                    onBackToMenu={() => setActiveMainTab('menu')}
                    onAddToCart={handleAddToCart}
                    orders={orders}
                  />
                </motion.div>
              ) : activeMainTab === 'menu' ? (
                <motion.div
                  key="menu-main-view"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35 }}
                  className="space-y-12"
                >
                  {/* Hero Banner Section */}
                  <section className="bg-slate-50/70 border-b border-slate-200/60 relative overflow-hidden py-14 md:py-20 lg:py-24">
                    <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-orange-100/30 rounded-full filter blur-[120px] pointer-events-none" />
                    <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-slate-100 rounded-full filter blur-[120px] pointer-events-none" />

                    <div className="px-4 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center relative z-10">
                      <div className="lg:col-span-7 space-y-6">
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-orange-50 border border-orange-100 text-orange-600 shadow-xs">
                          <Sparkles className="w-3.5 h-3.5 text-orange-500 fill-orange-500/10" />
                          Michelin-Starred Gastronomy
                        </span>
                        
                        <h2 className="font-display font-black text-slate-950 text-3xl md:text-5xl lg:text-6xl leading-tight md:leading-none tracking-tight">
                          Fine Dining Delivered <br className="hidden md:inline" />
                          to Your Private Estate.
                        </h2>
                        
                        <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-xl font-light">
                          Experience world-class French-American culinary fusion curated by our resident Master Chefs. Fully catered, temperature-regulated premium white-glove transport.
                        </p>

                        {/* High-contrast CTA Buttons row */}
                        <div className="flex flex-wrap gap-3.5 pt-1">
                          <button
                            onClick={() => {
                              const el = document.getElementById('gourmet-menu-section');
                              if (el) el.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="px-6 py-3.5 rounded-full bg-orange-600 hover:bg-orange-700 text-white font-black text-xs uppercase tracking-wider transition-all duration-300 shadow-md shadow-orange-600/10 active:scale-95 cursor-pointer flex items-center gap-2"
                          >
                            Order Culinary Curation ➔
                          </button>
                          <button
                            onClick={() => {
                              setActiveMainTab('profile');
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="px-6 py-3.5 rounded-full bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/80 font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-xs active:scale-95 cursor-pointer"
                          >
                            Meet Our Master Chefs
                          </button>
                        </div>

                        {/* Highlights Indicators row */}
                        <div className="flex flex-wrap gap-4 pt-3">
                          <div className="flex items-center gap-2.5 bg-white border border-slate-200/70 rounded-2xl p-2.5 px-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                            <Star className="w-4.5 h-4.5 text-orange-500 fill-orange-500" />
                            <div className="text-xs">
                              <span className="font-black text-slate-900 block">{restaurantInfo.rating} ★</span>
                              <span className="text-[10px] text-slate-500 font-medium">{reviews.length}+ reviews</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2.5 bg-white border border-slate-200/70 rounded-2xl p-2.5 px-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                            <Clock className="w-4.5 h-4.5 text-orange-500" />
                            <div className="text-xs">
                              <span className="font-black text-slate-900 block">{restaurantInfo.deliveryTime}</span>
                              <span className="text-[10px] text-slate-500 font-medium">White-glove arrival</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2.5 bg-white border border-slate-200/70 rounded-2xl p-2.5 px-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                            <MapPin className="w-4.5 h-4.5 text-orange-500" />
                            <div className="text-xs">
                              <span className="font-black text-slate-900 block">Park Avenue, NY</span>
                              <span className="text-[10px] text-slate-500 font-medium">Upper Manhattan delivery</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Cover Photo */}
                      <div className="lg:col-span-5 relative aspect-16/10 lg:aspect-square bg-slate-100 rounded-[2.25rem] overflow-hidden border border-slate-200/80 shadow-[0_24px_50px_rgba(0,0,0,0.06)] group">
                        <img
                          src={restaurantInfo.coverImage || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600'}
                          alt="Premium Food Plate"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-106"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />
                        <div className="absolute bottom-5 left-5 right-5 text-slate-900 bg-white/95 backdrop-blur-md p-5 rounded-2xl border border-slate-200/60 shadow-lg">
                           <span className="text-[9px] uppercase tracking-widest font-black text-orange-600 block mb-0.5">Signature Platter</span>
                           <h3 className="font-display font-extrabold text-sm text-slate-950 leading-snug">Umbrian Black Truffle & Dry-Aged Ribeye Burger</h3>
                           <p className="text-[11px] text-slate-500 mt-1.5 font-light leading-snug">Shaved black truffles, cave-aged Gruyère, served with fresh hand-cut parmigiano frites.</p>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Highlights Bento row */}
                  <main className="px-4 md:px-8 space-y-16 pb-16">
                    <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 pt-2">
                      <button
                        onClick={() => handleBentoClick('reviews')}
                        className="bg-slate-50/90 hover:bg-slate-100/90 border border-slate-200/80 rounded-2.5xl p-4 text-left hover:border-orange-500/30 transition-all duration-300 group cursor-pointer relative overflow-hidden text-slate-800 shadow-xs"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="p-2 rounded-xl bg-orange-100/50 border border-orange-200 text-orange-600">
                            <Star className="w-4.5 h-4.5 fill-orange-500/10" />
                          </span>
                          <span className="text-[10px] text-emerald-600 font-bold">Verified</span>
                        </div>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 block">System Rating</span>
                        <span className="text-lg font-black text-slate-950 block mt-0.5 font-display">{restaurantInfo.rating} ★</span>
                        <span className="text-[9px] text-slate-500 group-hover:text-orange-600 font-medium transition-colors block mt-1">Click to view reviews ➔</span>
                      </button>

                      <button
                        onClick={() => handleBentoClick('map')}
                        className="bg-slate-50/90 hover:bg-slate-100/90 border border-slate-200/80 rounded-2.5xl p-4 text-left hover:border-orange-500/30 transition-all duration-300 group cursor-pointer relative overflow-hidden text-slate-800 shadow-xs"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="p-2 rounded-xl bg-indigo-100/50 border border-indigo-200 text-indigo-600">
                            <Clock className="w-4.5 h-4.5" />
                          </span>
                          <span className="text-[10px] text-indigo-600 font-bold">Courier</span>
                        </div>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 block">Transit Estimate</span>
                        <span className="text-lg font-black text-slate-950 block mt-0.5 font-display">{restaurantInfo.deliveryTime}</span>
                        <span className="text-[9px] text-indigo-600 font-medium block mt-1">Trace dispatch ➔</span>
                      </button>

                      <button
                        onClick={() => handleBentoClick('map')}
                        className="bg-slate-50/90 hover:bg-slate-100/90 border border-slate-200/80 rounded-2.5xl p-4 text-left hover:border-orange-500/30 transition-all duration-300 group cursor-pointer relative overflow-hidden text-slate-800 shadow-xs"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="p-2 rounded-xl bg-emerald-100/50 border border-emerald-200 text-emerald-600">
                            <MapPin className="w-4.5 h-4.5" />
                          </span>
                          <span className="text-[10px] text-emerald-600 font-bold">1.2 mi</span>
                        </div>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 block">Radius Distance</span>
                        <span className="text-lg font-black text-slate-950 block mt-0.5 font-display">Upper East</span>
                        <span className="text-[9px] text-slate-500 group-hover:text-orange-600 font-medium transition-colors block mt-1">Show on map ➔</span>
                      </button>

                      <div className="bg-slate-50/90 border border-slate-200/80 rounded-2.5xl p-4 text-left relative overflow-hidden text-slate-800 shadow-xs">
                        <div className="flex items-center justify-between mb-2">
                          <span className="p-2 rounded-xl bg-rose-100/50 border border-rose-200 text-rose-600">
                            <ShoppingBag className="w-4.5 h-4.5" />
                          </span>
                          <span className="text-[10px] text-orange-600 font-black">Free &gt; $40</span>
                        </div>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 block">Delivery Charge</span>
                        <span className="text-lg font-black text-slate-950 block mt-0.5 font-display">
                          {restaurantInfo.deliveryFee === 0 ? 'Complimentary' : `$${restaurantInfo.deliveryFee.toFixed(2)}`}
                        </span>
                        <span className="text-[9px] text-slate-500 block mt-1">White-glove containment</span>
                      </div>

                      <button
                        onClick={() => handleBentoClick('schedule')}
                        className="bg-slate-50/90 hover:bg-slate-100/90 border border-slate-200/80 rounded-2.5xl p-4 text-left hover:border-orange-500/30 transition-all duration-300 group cursor-pointer relative overflow-hidden text-slate-800 shadow-xs"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className={`p-1.5 rounded-lg text-xs font-bold ${
                            restaurantStatus === 'open' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : restaurantStatus === 'busy' ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-rose-100 text-rose-700 border border-rose-200'
                          }`}>
                            {restaurantStatus === 'open' ? '● Open' : restaurantStatus === 'busy' ? '● Busy' : '● Closed'}
                          </span>
                        </div>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 block">Kitchen State</span>
                        <span className="text-base font-black text-slate-950 block mt-0.5 truncate font-display">
                          {restaurantStatus === 'open' ? 'Gourmet Active' : restaurantStatus === 'busy' ? 'High Demand' : 'Offline Prep'}
                        </span>
                        <span className="text-[9px] text-slate-500 group-hover:text-orange-600 font-medium transition-colors block mt-1">Check full hours ➔</span>
                      </button>

                      <button
                        onClick={() => handleBentoClick('bestseller')}
                        className="bg-orange-50/70 hover:bg-orange-50 border border-orange-200 rounded-2.5xl p-4 text-left hover:border-orange-500/30 transition-all duration-300 group cursor-pointer relative overflow-hidden text-slate-800 shadow-xs"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-base">🔥</span>
                           <span className="bg-orange-600 text-white text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">Chef Pick</span>
                        </div>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-orange-600 block font-display">Wagyu Burger</span>
                        <span className="text-xs text-slate-650 leading-tight block mt-1 font-sans">Tap to inspect bestseller specs</span>
                      </button>
                    </section>

                    {/* Offers Section */}
                    <section className="bg-slate-50 border border-slate-200/80 rounded-[2rem] p-6 shadow-xs backdrop-blur-md">
                      <OffersCarousel
                        offers={offers}
                        onApplyCode={setAppliedCode}
                        activeCode={appliedCode}
                      />
                    </section>

                    {/* Menu Section Grid with sticky categories scroll */}
                    <section id="gourmet-menu-section" className="space-y-6 pt-2">
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div>
                          <h2 className="font-display font-black text-slate-950 text-xl md:text-2xl tracking-tight flex items-center gap-2">
                            {viewingFavoritesOnly ? (
                              <>
                                <Heart className="w-5.5 h-5.5 text-rose-500 fill-rose-500" />
                                Saved Gourmet Favorites
                              </>
                            ) : (
                              'Explore Gourmet Culinary Menu'
                            )}
                          </h2>
                          <p className="text-slate-500 text-xs">
                            {viewingFavoritesOnly
                              ? 'Quickly access your bookmarked culinary plates'
                              : 'Filter by culinary categories or input target ingredients'}
                          </p>
                        </div>

                         {/* Search Input */}
                         <div className="relative w-full md:w-[360px] group">
                           <Search className="absolute left-4.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-450 group-focus-within:text-orange-600 transition-colors duration-200" />
                           <input
                             id="main-search-input"
                             type="text"
                             placeholder="Search for food..."
                             value={searchQuery}
                             onChange={(e) => setSearchQuery(e.target.value)}
                             className="w-full pl-12 pr-10 py-3 text-sm border border-slate-100 focus:border-orange-500/30 focus:outline-hidden focus:ring-4 focus:ring-orange-500/5 bg-white text-slate-800 rounded-full transition-all duration-250 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.05)] focus:shadow-[0_8px_32px_rgba(234,88,12,0.08)]"
                           />
                           {searchQuery && (
                             <button
                               onClick={() => setSearchQuery('')}
                               className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-650 flex items-center justify-center text-[10px] transition-all cursor-pointer"
                               title="Clear search"
                             >
                               ✕
                             </button>
                           )}
                         </div>
                       </div>

                       {/* Sticky Categories & Curation Row */}
                       {!viewingFavoritesOnly && (
                         <div className="space-y-3.5 sticky top-[68px] md:top-[74px] z-30 bg-white/95 backdrop-blur-md py-3 border-y border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
                           {/* Categories */}
                           <div className="flex gap-2.5 overflow-x-auto pb-1 scroll-smooth no-scrollbar select-none">
                             {CATEGORIES.map((cat) => {
                               const active = selectedCategory === cat;
                               return (
                                 <button
                                   key={cat}
                                   onClick={() => setSelectedCategory(cat)}
                                   className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap cursor-pointer transition-all duration-200 ${
                                     active
                                       ? 'bg-orange-600 text-white shadow-md shadow-orange-600/15 scale-102 font-extrabold'
                                       : 'bg-slate-100 hover:bg-slate-200/85 text-slate-600 hover:text-slate-900 font-medium'
                                   }`}
                                 >
                                   {cat}
                                 </button>
                               );
                             })}
                           </div>

                          {/* Curations */}
                          <div className="flex gap-2 overflow-x-auto pb-1 border-t border-slate-200/60 pt-2.5">
                            <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest shrink-0 self-center mr-1">Curation:</span>
                            {[
                              { id: 'all', label: 'All Masterpieces' },
                              { id: 'featured', label: '✨ Chef Specials' },
                              { id: 'bestseller', label: '🔥 Bestsellers' },
                              { id: 'recommended', label: '🌟 Highly Recommended' },
                              { id: 'new', label: '🆕 New Arrivals' },
                              { id: 'popular', label: '📈 Popular This Week' }
                            ].map((cur) => {
                              const active = curationFilter === cur.id;
                              return (
                                <button
                                  key={cur.id}
                                  onClick={() => setCurationFilter(cur.id as any)}
                                  className={`px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                                    active
                                      ? 'bg-slate-950 text-white font-black'
                                      : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                                  }`}
                                >
                                  {cur.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Products Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-2">
                        {isLoadingSkeleton ? (
                          Array.from({ length: 4 }).map((_, i) => (
                            <ProductCard
                              key={i}
                              product={products[0] || INITIAL_PRODUCTS[0]}
                              isFavorite={false}
                              onToggleFavorite={() => {}}
                              onAddToCart={() => {}}
                              onSelect={() => {}}
                              isLoading={true}
                            />
                          ))
                        ) : filteredProducts.length === 0 ? (
                          <div className="col-span-full py-12">
                            <EmptyState
                              type={
                                viewingFavoritesOnly
                                  ? 'favorites'
                                  : searchQuery
                                  ? 'no-results'
                                  : 'search'
                              }
                              title={
                                viewingFavoritesOnly
                                  ? 'No saved culinary items'
                                  : searchQuery
                                  ? `No results for "${searchQuery}"`
                                  : undefined
                              }
                              description={
                                viewingFavoritesOnly
                                  ? 'Click the heart icon on any master dish across our menu list to instantly bookmark.'
                                  : 'Try expanding your text criteria or clear filters.'
                              }
                              actionText={viewingFavoritesOnly ? "View Culinary Menu" : "Clear Filters"}
                              onAction={
                                viewingFavoritesOnly
                                  ? () => setViewingFavoritesOnly(false)
                                  : () => {
                                      setSearchQuery('');
                                      setSelectedCategory('All');
                                      setCurationFilter('all');
                                    }
                              }
                            />
                          </div>
                        ) : (
                          filteredProducts.map((prod) => (
                            <ProductCard
                              key={prod.id}
                              product={prod}
                              isFavorite={favorites.includes(prod.id)}
                              onToggleFavorite={handleToggleFavorite}
                              onAddToCart={(p, e) => {
                                e.stopPropagation();
                                handleAddToCart(p, 1);
                              }}
                              onSelect={() => setSelectedProduct(prod)}
                            />
                          ))
                        )}
                      </div>
                    </section>

                    {/* Customer Reviews Section */}
                    <section id="customer-reviews-section" className="pt-6">
                      <ReviewsSection
                        reviews={reviews}
                        onHelpfulClick={handleGlobalHelpfulClick}
                        averageRating={4.9}
                        totalReviews={reviews.length}
                      />
                    </section>
                  </main>
                </motion.div>
              ) : (
                /* Profile view */
                <motion.div
                  key="restaurant-profile-view"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-2 px-4 md:px-8 pb-12"
                >
                  {/* Column 1 */}
                  <div className="lg:col-span-7 space-y-6">
                    {/* Cover image card */}
                    <div className="relative h-64 rounded-3xl overflow-hidden border border-white/10 bg-slate-900 shadow-xl group">
                      <img
                        src={restaurantInfo.coverImage || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600'}
                        alt="L'Etoile Dining Room"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                      
                      {/* Logo Overlap */}
                      <div className="absolute bottom-6 left-6 flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-white/20 flex items-center justify-center shadow-lg text-amber-400">
                          <img
                            src={restaurantInfo.logo}
                            alt="Logo"
                            className="w-10 h-10 object-contain"
                            onError={(e) => {
                              // fallback to icon if image fails
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                        <div>
                          <h3 className="text-xl font-black font-display text-white">{restaurantInfo.name}</h3>
                          <p className="text-xs text-slate-300">Park Avenue, Upper Manhattan</p>
                        </div>
                      </div>
                    </div>

                    {/* philosophy */}
                    <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 space-y-3 shadow-xs">
                      <span className="text-[10px] uppercase font-black tracking-widest text-orange-600 block">About Our Philosophy</span>
                      <h4 className="text-lg font-black font-display text-slate-950">Gourmet Curation & Temperature Regulated Despatch</h4>
                      <p className="text-xs text-slate-650 leading-relaxed font-sans">
                        {restaurantInfo.about || "Experience world-class French-American culinary fusion curated by our resident Master Chefs."}
                      </p>
                    </div>

                    {/* Contact details */}
                    <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 space-y-4 shadow-xs">
                      <span className="text-[10px] uppercase font-black tracking-widest text-orange-600 block">Culinary Concierge Services</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1 bg-white p-3.5 rounded-2xl border border-slate-200 text-xs">
                          <span className="text-slate-500 block">Phone Inquiries</span>
                          <strong className="text-slate-950 text-sm font-mono font-bold">{restaurantInfo.phone || '+1 (212) 555-0199'}</strong>
                          <p className="text-[10px] text-slate-400">24/7 dedicated estate planner support</p>
                        </div>

                        <a
                          href={`https://wa.me/${(restaurantInfo.whatsapp || '+1 (212) 555-0199').replace(/\D/g, '')}?text=Hello%20L'Etoile%20Concierge%20Service%20Planning`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="space-y-1 bg-emerald-50 hover:bg-emerald-100/70 border border-emerald-200 p-3.5 rounded-2xl text-xs block transition-colors text-left"
                        >
                          <span className="text-emerald-700 font-bold block">WhatsApp Concierge</span>
                          <strong className="text-slate-900 text-sm font-mono font-bold">Chat on WhatsApp ➔</strong>
                          <p className="text-[10px] text-emerald-600">Instantly query daily specials, private bookings & caterings.</p>
                        </a>
                      </div>

                      {/* Social handles */}
                      <div className="border-t border-slate-200 pt-4 flex justify-between items-center text-xs">
                        <span className="text-slate-500">Gourmet Social feeds</span>
                        <div className="flex gap-2">
                          {['Instagram', 'Facebook', 'Threads'].map((feed) => (
                            <span
                              key={feed}
                              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-[10px] font-bold text-slate-600"
                            >
                              @EtoileGastronomique
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Column 2 */}
                  <div id="dispatch-map-container" className="lg:col-span-5 space-y-6">
                    <div className="bg-slate-50 border border-slate-200/80 rounded-3xl overflow-hidden p-1 shadow-md">
                      <RestaurantMap />
                    </div>

                    <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-5 space-y-3 shadow-xs">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-orange-600" />
                        <span className="text-xs font-black uppercase tracking-wider text-slate-700">Dining Schedule & Operations</span>
                      </div>
                      <div className="divide-y divide-slate-200 space-y-2 text-xs">
                        {restaurantInfo.hours.map((h, i) => (
                          <div key={i} className="flex justify-between items-center pt-2 first:pt-0">
                            <span className="text-slate-600 font-bold">{h.days}</span>
                            <span className="font-mono text-orange-600 font-bold">{h.time}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

             {/* Quick FAQ Footer */}
             <footer className="border-t border-slate-200/80 mt-16 pt-12 pb-8 px-6 md:px-12 bg-slate-50 rounded-t-[2.5rem]">
               <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10">
                 {/* Brand info */}
                 <div className="md:col-span-4 space-y-4 text-left">
                   <div className="flex items-center gap-2.5">
                     <div className="p-2 bg-orange-100 border border-orange-200 text-orange-600 rounded-xl flex items-center justify-center">
                       <UtensilsCrossed className="w-4 h-4" />
                     </div>
                     <span className="font-display font-black text-slate-950 tracking-tight text-sm">L'Étoile Haute Gastronomie</span>
                   </div>
                   <p className="leading-relaxed text-slate-600 text-xs max-w-sm">
                     A bespoke French-American culinary experience designed exclusively for Manhattan estates. Delivering gourmet masterworks under strict, temperature-controlled safety regulations.
                   </p>
                 </div>

                 {/* Column 2: Operations */}
                 <div className="md:col-span-3 space-y-3.5 text-left">
                   <h5 className="font-display font-black text-slate-950 uppercase tracking-widest text-[10px] text-orange-600">Dining Operations</h5>
                   <ul className="space-y-2 text-xs text-slate-650">
                     <li className="flex justify-between items-center pr-4">
                       <span className="font-normal">Weekday Prep</span>
                       <span className="font-mono font-bold text-slate-800">17:00 – 23:00</span>
                     </li>
                     <li className="flex justify-between items-center pr-4">
                       <span className="font-normal">Weekend Gala</span>
                       <span className="font-mono font-bold text-slate-800">16:00 – 01:00</span>
                     </li>
                     <li className="flex justify-between items-center pr-4">
                       <span className="font-normal">Private Caterings</span>
                       <span className="text-orange-600 font-extrabold uppercase tracking-wider text-[9px]">Custom Booking</span>
                     </li>
                   </ul>
                 </div>

                 {/* Column 3: Concierge */}
                 <div className="md:col-span-3 space-y-3.5 text-left">
                   <h5 className="font-display font-black text-slate-950 uppercase tracking-widest text-[10px] text-orange-600">Estate Concierge</h5>
                   <ul className="space-y-2 text-xs text-slate-650">
                     <li className="flex items-center gap-2">
                       <span className="text-[9px] font-black bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">TEL</span>
                       <span className="font-mono text-slate-800 font-bold">{restaurantInfo.phone || '+1 (212) 555-0199'}</span>
                     </li>
                     <li className="flex items-center gap-2">
                       <span className="text-[9px] font-black bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded">CHAT</span>
                       <span className="font-bold text-slate-800 hover:text-emerald-600 transition-colors cursor-pointer">WhatsApp Planner</span>
                     </li>
                     <li>
                       <span className="font-light text-slate-500">concierge@letoile-gastronomy.com</span>
                     </li>
                   </ul>
                 </div>

                 {/* Column 4: Security */}
                 <div className="md:col-span-2 space-y-3.5 text-left">
                   <h5 className="font-display font-black text-slate-950 uppercase tracking-widest text-[10px] text-orange-600">Secured Protocol</h5>
                   <div className="space-y-2.5">
                     <p className="flex items-center gap-2 text-emerald-600 text-xs font-bold">
                       <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                       SSL Secure Checkout
                     </p>
                     <p className="text-[10px] text-slate-500 leading-snug">
                       All personal details and payments are shielded via state-of-the-art PCI-DSS compliant security models.
                     </p>
                   </div>
                 </div>
               </div>

               {/* Copyright line */}
               <div className="border-t border-slate-200 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-slate-500 font-mono">
                 <span>© {new Date().getFullYear()} L'Étoile Manhattan Group. All rights reserved.</span>
                 <div className="flex gap-4">
                   <span className="hover:text-slate-850 transition-colors cursor-pointer">Terms of Curation</span>
                   <span className="hover:text-slate-850 transition-colors cursor-pointer">Privacy Charter</span>
                   <span className="hover:text-slate-850 transition-colors cursor-pointer">Culinary Integrity</span>
                 </div>
               </div>
             </footer>

            {/* Product Detail Modal */}
            <AnimatePresence>
              {selectedProduct && (
                <ProductDetailModal
                  product={selectedProduct}
                  allProducts={products}
                  favorites={favorites}
                  onToggleFavorite={handleToggleFavorite}
                  onAddToCart={handleAddToCart}
                  onClose={() => setSelectedProduct(null)}
                  onSelectProduct={(p) => setSelectedProduct(p)}
                />
              )}
            </AnimatePresence>

            {/* Cart Drawer */}
            <AnimatePresence>
              {isCartOpen && (
                <CartDrawer
                  isOpen={isCartOpen}
                  onClose={() => setIsCartOpen(false)}
                  cartItems={cart}
                  onUpdateQuantity={handleUpdateCartQuantity}
                  onRemoveItem={handleRemoveFromCart}
                  onClearCart={handleClearCart}
                  restaurantInfo={restaurantInfo}
                  appliedCode={appliedCode}
                  onApplyCode={setAppliedCode}
                  onPlaceOrder={handlePlaceOrder}
                />
              )}
            </AnimatePresence>

            {/* Floating Shopping Cart Button */}
            <AnimatePresence>
              {cart.length > 0 && !isCartOpen && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8, y: 50 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 50 }}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsCartOpen(true)}
                  className="fixed bottom-6 right-6 z-40 bg-orange-600 hover:bg-orange-700 text-white rounded-full p-4 shadow-[0_12px_40px_rgba(234,88,12,0.35)] flex items-center gap-2.5 cursor-pointer border border-orange-500 font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  <div className="relative">
                    <ShoppingBag className="w-5 h-5" />
                    <span className="absolute -top-1.5 -right-1.5 bg-white text-orange-600 text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-orange-500 shadow-xs font-mono">
                      {cart.reduce((sum, item) => sum + item.quantity, 0)}
                    </span>
                  </div>
                  <span className="font-black pr-1">Basket: ${cart.reduce((acc, item) => {
                    const addonsPrice = item.selectedAddons ? item.selectedAddons.reduce((sum, add) => sum + add.price, 0) : 0;
                    return acc + (item.product.price + addonsPrice) * item.quantity;
                  }, 0).toFixed(2)}</span>
                </motion.button>
              )}
            </AnimatePresence>

                </motion.div>
              )}
            </AnimatePresence>
          }
        />
      </Routes>
    </AppLayout>
  );
}
