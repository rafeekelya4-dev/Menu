import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin,
  Clock,
  Compass,
  CheckCircle2,
  AlertCircle,
  Search,
  ShoppingBag,
  ArrowRight,
  UserCheck,
  Phone,
  ShieldCheck,
  UtensilsCrossed,
  Info
} from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { Order, OrderStatus, Product } from '../types';

interface OrderStatusTrackerProps {
  onBackToMenu: () => void;
  accentColorClass?: string;
  onAddToCart?: (
    product: Product,
    quantity?: number,
    notes?: string,
    selectedAddons?: { id: string; name: string; price: number; }[]
  ) => void;
  orders?: Order[];
}

const STATUS_STEPS = [
  {
    key: 'placed',
    label: 'Order Placed',
    desc: 'Your gourmet order has been successfully placed.',
    statuses: ['pending'],
    icon: ShoppingBag
  },
  {
    key: 'confirmed',
    label: 'Confirmed',
    desc: 'Approved and scheduled by our culinary concierge.',
    statuses: ['confirmed'],
    icon: ShieldCheck
  },
  {
    key: 'preparing',
    label: 'Preparing',
    desc: 'Our resident Master Chefs are preparing your masterpieces.',
    statuses: ['preparing', 'cooking', 'ready'],
    icon: UtensilsCrossed
  },
  {
    key: 'transit',
    label: 'In Transit',
    desc: 'In transit under temperature-regulated white-glove transit.',
    statuses: ['dispatched', 'out_for_delivery'],
    icon: Compass
  },
  {
    key: 'delivered',
    label: 'Delivered',
    desc: 'Arrived at your private estate. Bon appétit!',
    statuses: ['delivered'],
    icon: CheckCircle2
  }
];

const HistoryOrderCard: React.FC<{
  order: Order;
  isActive: boolean;
  onTrack: () => void;
  onReorder: () => void;
}> = ({ order, isActive, onTrack, onReorder }) => {
  const [isReordering, setIsReordering] = useState(false);

  // Status color mapper
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'pending':
        return { bg: 'bg-amber-50 border-amber-200 text-amber-700', label: 'Pending' };
      case 'confirmed':
        return { bg: 'bg-blue-50 border-blue-200 text-blue-700', label: 'Confirmed' };
      case 'preparing':
      case 'cooking':
        return { bg: 'bg-orange-50 border-orange-200 text-orange-700', label: 'Preparing' };
      case 'ready':
        return { bg: 'bg-indigo-50 border-indigo-200 text-indigo-700', label: 'Ready' };
      case 'dispatched':
      case 'out_for_delivery':
        return { bg: 'bg-purple-50 border-purple-200 text-purple-700', label: 'In Transit' };
      case 'delivered':
        return { bg: 'bg-emerald-50 border-emerald-200 text-emerald-700', label: 'Delivered' };
      case 'cancelled':
        return { bg: 'bg-rose-50 border-rose-200 text-rose-700', label: 'Cancelled' };
      default:
        return { bg: 'bg-slate-50 border-slate-200 text-slate-700', label: status };
    }
  };

  const statusStyle = getStatusStyle(order.status);

  return (
    <div
      className={`bg-white border rounded-2xl p-5 transition-all duration-200 flex flex-col justify-between h-full ${
        isActive
          ? 'border-orange-500 ring-2 ring-orange-500/10 shadow-md'
          : 'border-slate-100 hover:border-slate-200 hover:shadow-xs'
      }`}
    >
      <div className="space-y-3">
        {/* Card Header */}
        <div className="flex justify-between items-center gap-2">
          <div>
            <span className="font-mono text-xs font-bold text-slate-800">
              #{order.id.replace('order-', '')}
            </span>
            <span className="text-[10px] text-slate-400 block font-sans">
              {order.timestamp ? new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
            </span>
          </div>
          <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full border ${statusStyle.bg}`}>
            {statusStyle.label}
          </span>
        </div>

        {/* Item Summary list */}
        <div className="space-y-1 py-1 max-h-24 overflow-y-auto">
          {order.items.map((item, i) => (
            <div key={i} className="text-[11px] text-slate-600 flex justify-between">
              <span className="truncate max-w-[180px] font-medium text-slate-700">
                {item.product.name}
              </span>
              <span className="font-mono text-slate-500 shrink-0">
                x{item.quantity}
              </span>
            </div>
          ))}
        </div>

        {/* Destination & Total info */}
        <div className="border-t border-slate-50 pt-2 flex justify-between items-center">
          <div className="text-[10px] text-slate-400 truncate max-w-[150px]">
            To: {order.address || 'Your Estate'}
          </div>
          <div className="font-mono font-bold text-xs text-orange-600">
            ${order.total.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-4 border-t border-slate-50 pt-3">
        <button
          onClick={onTrack}
          className={`flex-1 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer text-center ${
            isActive
              ? 'bg-orange-50 border border-orange-200 text-orange-600 hover:bg-orange-100/50'
              : 'bg-slate-50 border border-slate-100 text-slate-600 hover:bg-slate-100'
          }`}
        >
          {isActive ? 'Tracking Live' : 'Track Order'}
        </button>
        <button
          onClick={() => {
            setIsReordering(true);
            onReorder();
            setTimeout(() => setIsReordering(false), 1000);
          }}
          disabled={isReordering}
          className="flex-1 py-2 bg-orange-600 hover:bg-orange-700 text-white border border-transparent rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all text-center flex items-center justify-center gap-1 cursor-pointer"
        >
          {isReordering ? (
            <span className="inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            'Re-order ➔'
          )}
        </button>
      </div>
    </div>
  );
};

export const OrderStatusTracker: React.FC<OrderStatusTrackerProps> = ({
  onBackToMenu,
  accentColorClass = 'orange',
  onAddToCart,
  orders = []
}) => {
  const [orderIdInput, setOrderIdInput] = useState('');
  const [activeOrderId, setActiveOrderId] = useState<string | null>(() => {
    // Attempt to get the last placed order ID
    const lastId = localStorage.getItem('les_last_placed_order_id');
    if (lastId) return lastId;
    
    // Otherwise check order history array
    const savedHistory = localStorage.getItem('les_my_orders');
    if (savedHistory) {
      try {
        const history = JSON.parse(savedHistory);
        if (Array.isArray(history) && history.length > 0) {
          return history[0];
        }
      } catch (e) {
        console.error(e);
      }
    }
    return null;
  });

  const [orderHistory, setOrderHistory] = useState<string[]>(() => {
    const saved = localStorage.getItem('les_my_orders');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resolvedHistoryOrders = React.useMemo(() => {
    let allOrders = orders || [];
    if (allOrders.length === 0) {
      const savedOrders = localStorage.getItem('les_orders');
      if (savedOrders) {
        try {
          allOrders = JSON.parse(savedOrders);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return orderHistory
      .map(id => allOrders.find(o => o.id === id))
      .filter((o): o is Order => !!o);
  }, [orderHistory, orders]);

  const handleReorder = (pastOrder: Order) => {
    if (!onAddToCart) {
      console.warn('onAddToCart is not provided to OrderStatusTracker');
      return;
    }
    pastOrder.items.forEach((item) => {
      onAddToCart(
        item.product,
        item.quantity,
        item.notes || '',
        item.selectedAddons || []
      );
    });
  };

  // Sync state and handle live updates from Firestore
  useEffect(() => {
    if (!activeOrderId) {
      setOrder(null);
      return;
    }

    setLoading(true);
    setError(null);

    // Setup real-time listener to Firestore doc
    const orderDocRef = doc(db, 'orders', activeOrderId);
    const unsubscribe = onSnapshot(
      orderDocRef,
      (docSnap) => {
        setLoading(false);
        if (docSnap.exists()) {
          setOrder({ id: docSnap.id, ...docSnap.data() } as Order);
          setError(null);
          
          // Add to history list if not already there
          setOrderHistory((prev) => {
            if (!prev.includes(activeOrderId)) {
              const updated = [activeOrderId, ...prev].slice(0, 5); // Keep last 5
              localStorage.setItem('les_my_orders', JSON.stringify(updated));
              return updated;
            }
            return prev;
          });
        } else {
          setOrder(null);
          setError(`Order ID "${activeOrderId}" could not be found. Please check spelling or verify in the console.`);
        }
      },
      (err) => {
        setLoading(false);
        setOrder(null);
        try {
          handleFirestoreError(err, OperationType.GET, `orders/${activeOrderId}`);
        } catch (wrappedErr: any) {
          setError('Failed to fetch real-time status. Please verify your connection.');
        }
      }
    );

    return () => unsubscribe();
  }, [activeOrderId]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = orderIdInput.trim();
    if (cleanId) {
      setActiveOrderId(cleanId);
      setOrderIdInput('');
    }
  };

  const getActiveStepIndex = (status: OrderStatus): number => {
    if (status === 'cancelled') return -1;
    
    // Find the step that contains the current status
    const stepIndex = STATUS_STEPS.findIndex((step) => step.statuses.includes(status));
    if (stepIndex !== -1) return stepIndex;

    // Fallback logic for cumulative index progression
    if (status === 'pending') return 0;
    if (status === 'confirmed') return 1;
    if (status === 'preparing' || status === 'cooking' || status === 'ready') return 2;
    if (status === 'dispatched' || status === 'out_for_delivery') return 3;
    if (status === 'delivered') return 4;
    
    return 0;
  };

  const activeStepIndex = order ? getActiveStepIndex(order.status) : -1;

  // Render step state
  const getStepState = (index: number) => {
    if (index < activeStepIndex) return 'completed';
    if (index === activeStepIndex) return 'active';
    return 'upcoming';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-slate-800">
      {/* Search Order Bar & Header */}
      <div className="text-center mb-10 space-y-3">
        <span className="text-[10px] uppercase font-black tracking-widest text-orange-600">
          Live Concierge Transit
        </span>
        <h2 className="font-display font-black text-slate-950 text-2xl md:text-3xl tracking-tight">
          Real-time Gourmet Order Tracker
        </h2>
        <p className="text-slate-500 text-xs max-w-md mx-auto">
          Monitor your temperature-regulated French-American masterpieces step-by-step as they travel to your estate.
        </p>

        {/* Input Form */}
        <form onSubmit={handleSearchSubmit} className="relative max-w-md mx-auto pt-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Enter Order ID to track (e.g. order-2481)..."
            value={orderIdInput}
            onChange={(e) => setOrderIdInput(e.target.value)}
            className="w-full pl-11 pr-32 py-3 text-xs border border-slate-200/80 focus:border-orange-500/80 focus:outline-hidden focus:ring-2 focus:ring-orange-500/10 bg-white text-slate-800 rounded-full transition-all shadow-xs font-mono"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-orange-600 hover:bg-orange-700 text-white font-bold text-[10px] uppercase tracking-wider px-5 py-2 rounded-full transition-colors cursor-pointer"
          >
            Locate Ticket
          </button>
        </form>

        {/* History Quick-links */}
        {orderHistory.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs">
            <span className="text-slate-400">Recent:</span>
            {orderHistory.map((histId) => (
              <button
                key={histId}
                onClick={() => setActiveOrderId(histId)}
                className={`px-2.5 py-1 rounded-full border transition-all cursor-pointer font-mono text-[10px] ${
                  activeOrderId === histId
                    ? 'bg-orange-50 border-orange-200 text-orange-600 font-bold shadow-2xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-950'
                }`}
              >
                #{histId.replace('order-', '')}
              </button>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="tracker-loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white border border-slate-200/80 rounded-3xl p-12 text-center shadow-xs"
          >
            <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-500 text-xs font-mono">Connecting to L'Étoile secure dispatch channel...</p>
          </motion.div>
        ) : error ? (
          <motion.div
            key="tracker-error"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-rose-50 border border-rose-200 text-rose-800 rounded-3xl p-6 text-center max-w-lg mx-auto shadow-xs"
          >
            <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
            <h4 className="font-bold text-sm text-rose-950">Ticket Connection Blocked</h4>
            <p className="text-xs text-rose-750 mt-1 leading-relaxed">
              {error}
            </p>
            <div className="mt-4 flex justify-center gap-3">
              <button
                onClick={onBackToMenu}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-full text-xs font-bold transition-colors cursor-pointer"
              >
                Browse Menu
              </button>
              <button
                onClick={() => {
                  const demoId = localStorage.getItem('les_last_placed_order_id') || 'order-9402';
                  setActiveOrderId(demoId);
                }}
                className="px-4 py-2 bg-white border border-rose-200 hover:bg-slate-50 text-rose-800 rounded-full text-xs font-bold transition-colors cursor-pointer"
              >
                Track Mock Order
              </button>
            </div>
          </motion.div>
        ) : order ? (
          <motion.div
            key="tracker-content"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-12"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Steps & Map card */}
            <div className="lg:col-span-7 space-y-6">
              {/* Main Ticket Banner */}
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs relative overflow-hidden">
                <div className="absolute top-0 right-0 h-16 w-16 bg-orange-100/30 rounded-bl-[4rem]" />
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5 mb-5">
                  <div>
                    <span className="text-[10px] font-mono uppercase bg-slate-100 text-slate-500 px-2.5 py-1 rounded-md font-bold">
                      Order Ticket ID: <span className="font-black text-slate-800 font-mono">{order.id}</span>
                    </span>
                    <h3 className="font-display font-black text-slate-950 text-lg mt-2">
                      Estate Delivery Status
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block font-mono">Estimated Arrival</span>
                    <span className="text-lg font-black font-display text-orange-600 block mt-0.5">
                      {order.status === 'delivered' ? 'Arrived ✓' : order.status === 'cancelled' ? 'Aborted' : '25–35 Mins'}
                    </span>
                  </div>
                </div>

                {/* Cancelled Alert State */}
                {order.status === 'cancelled' ? (
                  <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl p-4 flex gap-3 items-center mb-4">
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    <div className="text-xs">
                      <strong className="text-rose-950 font-bold block">Order Aborted / Cancelled</strong>
                      This transaction was refunded or cancelled by the dining managers.
                    </div>
                  </div>
                ) : (
                  /* Vertical Progress Stepper */
                  <div className="space-y-6 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100 pb-2">
                    {STATUS_STEPS.map((step, idx) => {
                      const state = getStepState(idx);
                      const StepIcon = step.icon;
                      
                      return (
                        <div key={step.key} className="flex gap-4 items-start relative z-10">
                          {/* Circle Dot with dynamic styles */}
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                              state === 'completed'
                                ? 'bg-orange-600 border-orange-600 text-white'
                                : state === 'active'
                                ? 'bg-white border-orange-600 text-orange-600 ring-4 ring-orange-500/15 scale-105'
                                : 'bg-slate-50 border-slate-200 text-slate-400'
                            }`}
                          >
                            <StepIcon className="w-4.5 h-4.5" />
                          </div>

                          {/* Content label */}
                          <div className="space-y-0.5">
                            <h4
                              className={`text-xs uppercase tracking-wider font-black ${
                                state === 'upcoming'
                                  ? 'text-slate-400'
                                  : 'text-slate-900'
                              }`}
                            >
                              {step.label}
                              {state === 'active' && (
                                <span className="ml-2 text-[9px] bg-orange-100 border border-orange-200 text-orange-600 px-1.5 py-0.5 rounded-full font-bold uppercase tracking-widest animate-pulse">
                                  Current Step
                                </span>
                              )}
                            </h4>
                            <p
                              className={`text-xs ${
                                state === 'upcoming'
                                  ? 'text-slate-400/80 font-light'
                                  : 'text-slate-500 font-normal'
                              }`}
                            >
                              {step.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Courier Detail Card */}
              {order.status !== 'cancelled' && order.status !== 'pending' && (
                <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-5 shadow-xs flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-orange-100/50 border border-orange-200 flex items-center justify-center text-orange-600 shrink-0">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <span className="text-[9px] uppercase tracking-wider font-black text-orange-600 block">Your Private Butler Courier</span>
                    <h4 className="text-xs font-black text-slate-900 font-display">{(order as any).courierName || 'Jean-Luc Moreau'}</h4>
                    <p className="text-[10px] text-slate-500 leading-none">{(order as any).courierNotes || 'Equipped with luxury climate-controlled security transit container.'}</p>
                  </div>
                  <a
                    href={`tel:${(order as any).courierPhone || '+12125550199'}`}
                    className="p-3 bg-white hover:bg-slate-100 rounded-2xl border border-slate-200 text-slate-600 hover:text-orange-600 transition-colors"
                    title="Call Courier"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                </div>
              )}
            </div>

            {/* Order Receipt breakdown */}
            <div className="lg:col-span-5 space-y-6">
              {/* Receipt Summary */}
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs text-xs space-y-5">
                <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
                  <h4 className="font-display font-black text-slate-950 uppercase tracking-widest text-[10px] text-orange-600">
                    Gourmet Ticket Breakdown
                  </h4>
                  <span className="font-mono text-[10px] text-slate-400">
                    {order.timestamp ? new Date(order.timestamp).toLocaleDateString() : 'Today'}
                  </span>
                </div>

                {/* Items */}
                <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto pr-1">
                  {order.items && order.items.map((item, i) => (
                    <div key={i} className="py-2.5 first:pt-0 last:pb-0 flex justify-between items-start gap-4">
                      <div className="space-y-0.5">
                        <p className="font-bold text-slate-900 leading-snug">
                          {item.product.name}
                          <span className="text-orange-600 font-black ml-1.5 font-mono">x{item.quantity}</span>
                        </p>
                        {item.notes && (
                          <p className="text-[10px] text-slate-400 italic font-sans">
                            Instructions: "{item.notes}"
                          </p>
                        )}
                      </div>
                      <span className="font-mono text-slate-800 font-bold shrink-0">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Math totals */}
                <div className="border-t border-slate-100 pt-4 space-y-2">
                  <div className="flex justify-between text-slate-500">
                    <span>Gourmet Subtotal</span>
                    <span className="font-mono font-bold text-slate-700">${order.subtotal?.toFixed(2) || (order.total * 0.85).toFixed(2)}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-medium">
                      <span>Claimed Discount Offer</span>
                      <span className="font-mono font-bold">-${order.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-500">
                    <span>White-Glove Transport</span>
                    <span className="font-mono font-bold text-slate-700">
                      {order.deliveryFee === 0 ? 'Complimentary' : `$${order.deliveryFee?.toFixed(2)}`}
                    </span>
                  </div>
                  {order.tipAmount > 0 && (
                    <div className="flex justify-between text-slate-500">
                      <span>Butler Gratuity</span>
                      <span className="font-mono font-bold text-slate-700">${order.tipAmount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="border-t border-slate-100 pt-3.5 flex justify-between text-slate-900 items-baseline">
                    <span className="font-bold text-xs uppercase tracking-wider text-slate-950 font-display">Total Charge</span>
                    <span className="font-mono text-base font-black text-orange-600">${order.total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Delivery Location */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 flex gap-2.5 items-start text-[11px] text-slate-600 leading-snug">
                  <MapPin className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-950 font-bold block mb-0.5">Delivery Destination:</strong>
                    {order.address || '740 Park Avenue, Apt 14B, New York, NY'}
                  </div>
                </div>
              </div>

              {/* Action row */}
              <div className="flex gap-3">
                <button
                  onClick={onBackToMenu}
                  className="flex-1 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-black uppercase tracking-wider rounded-full text-center transition-colors shadow-xs cursor-pointer"
                >
                  Return to Menu
                </button>
                <a
                  href={`https://wa.me/${('+1 (212) 555-0199').replace(/\D/g, '')}?text=Hello%20L'Etoile%20Concierge.%20Inquiring%20about%20Order%20${order.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider rounded-full text-center transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-2"
                >
                  Chat Concierge ➔
                </a>
              </div>
            </div>
          </div>

            {/* Session Order History for active order */}
            {resolvedHistoryOrders.length > 0 && (
              <div className="pt-8 border-t border-slate-100 space-y-4">
                <h3 className="font-display font-black text-slate-950 text-sm flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-600" />
                  Your Session Order History
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {resolvedHistoryOrders.map((historyOrder) => (
                    <HistoryOrderCard
                      key={historyOrder.id}
                      order={historyOrder}
                      isActive={activeOrderId === historyOrder.id}
                      onTrack={() => setActiveOrderId(historyOrder.id)}
                      onReorder={() => handleReorder(historyOrder)}
                    />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="tracker-empty-or-history"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            {resolvedHistoryOrders.length === 0 ? (
              <div className="bg-white border border-slate-200/80 rounded-3xl p-12 text-center max-w-lg mx-auto shadow-xs space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-100 border border-orange-200 text-orange-600 flex items-center justify-center mx-auto mb-2">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h3 className="font-display font-black text-slate-950 text-lg">No Active Ticket Selected</h3>
                <p className="text-slate-500 text-xs leading-relaxed max-w-sm mx-auto">
                  You haven't placed any orders in this session, or tracked any tickets yet. Please place an order, or enter an Order ID in the locator bar above.
                </p>
                <div className="pt-2">
                  <button
                    onClick={onBackToMenu}
                    className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-black text-xs uppercase tracking-wider rounded-full transition-colors cursor-pointer"
                  >
                    Explore Culinary Menu
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Visual state to prompt selection */}
                <div className="bg-slate-50/50 border border-slate-100 rounded-3xl p-6 text-center max-w-md mx-auto shadow-2xs space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-orange-100/60 border border-orange-200/50 text-orange-600 flex items-center justify-center mx-auto">
                    <Info className="w-5 h-5" />
                  </div>
                  <h3 className="font-display font-bold text-slate-900 text-sm">Select an Order to Track</h3>
                  <p className="text-slate-500 text-[11px] leading-relaxed max-w-xs mx-auto">
                    Click "Track Order" on any of your recent session orders below to view its real-time white-glove delivery progress!
                  </p>
                </div>

                {/* Grid list of history orders */}
                <div className="space-y-4">
                  <h3 className="font-display font-black text-slate-950 text-base flex items-center gap-2">
                    <Clock className="w-4 h-4 text-orange-600" />
                    Your Session Order History
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {resolvedHistoryOrders.map((historyOrder) => (
                      <HistoryOrderCard
                        key={historyOrder.id}
                        order={historyOrder}
                        isActive={activeOrderId === historyOrder.id}
                        onTrack={() => setActiveOrderId(historyOrder.id)}
                        onReorder={() => handleReorder(historyOrder)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
