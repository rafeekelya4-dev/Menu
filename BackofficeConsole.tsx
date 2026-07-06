import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sliders,
  Check,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Trash2,
  Edit3,
  Plus,
  Users,
  Star,
  MessageSquare,
  Settings,
  BarChart3,
  Bell,
  Truck,
  Percent,
  UserCheck,
  MapPin,
  PlusCircle,
  Volume2,
  Briefcase,
  HelpCircle,
  Clock,
  Eye,
  Menu,
  Heart,
  LogOut,
  UtensilsCrossed
} from 'lucide-react';
import { Product, Review, Offer, RestaurantInfo, Order, Coupon, Employee, CustomerCRM, OrderStatus } from '../../types';
import { Button, Card, Input, Badge, Avatar, Tag, Counter, Checkbox, Radio, LoadingSkeleton } from '../../components/ui';

interface BackofficeConsoleProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  reviews: Review[];
  setReviews: React.Dispatch<React.SetStateAction<Review[]>>;
  offers: Offer[];
  setOffers: React.Dispatch<React.SetStateAction<Offer[]>>;
  restaurantInfo: RestaurantInfo;
  setRestaurantInfo: React.Dispatch<React.SetStateAction<RestaurantInfo>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  coupons: Coupon[];
  setCoupons: React.Dispatch<React.SetStateAction<Coupon[]>>;
  employees: Employee[];
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;
  customers: CustomerCRM[];
  setCustomers: React.Dispatch<React.SetStateAction<CustomerCRM[]>>;
  activeAccentColor: string;
  setActiveAccentColor: (color: string) => void;
  addToast: (msg: string, type: 'success' | 'warning' | 'error' | 'info') => void;
  onLogout?: () => void;
}

export const BackofficeConsole: React.FC<BackofficeConsoleProps> = ({
  products,
  setProducts,
  reviews,
  setReviews,
  offers,
  setOffers,
  restaurantInfo,
  setRestaurantInfo,
  orders,
  setOrders,
  coupons,
  setCoupons,
  employees,
  setEmployees,
  customers,
  setCustomers,
  activeAccentColor,
  setActiveAccentColor,
  addToast,
  onLogout,
}) => {
  const navigate = useNavigate();
  // Navigation State for Admin Sidebar Modules
  const [activeModule, setActiveModule] = useState<string>('overview');

  // Sub-states for specific modules
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);
  const [reviewReplyState, setReviewReplyState] = useState<{ [id: string]: string }>({});
  
  // New Product Form State
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('Signature Mains');
  const [newProdImage, setNewProdImage] = useState('https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800');
  const [newProdTags, setNewProdTags] = useState('Chef Special');

  // New Coupon Form State
  const [newCode, setNewCode] = useState('');
  const [newVal, setNewVal] = useState('');
  const [newMinSpend, setNewMinSpend] = useState('');
  const [newType, setNewType] = useState<'percentage' | 'fixed'>('percentage');

  // Simulator States
  const [selectedSimOrderId, setSelectedSimOrderId] = useState<string>('');
  const [autoPilotActive, setAutoPilotActive] = useState(false);
  const [autoPilotSpeed, setAutoPilotSpeed] = useState<number>(8); // 8 seconds per step
  const [simLogs, setSimLogs] = useState<string[]>(['[00:00:00] 🔵 Simulator Engine Ready. Waiting for order...']);
  const [simCourierName, setSimCourierName] = useState('Jean-Luc Moreau');
  const [simCourierPhone, setSimCourierPhone] = useState('+1 (212) 555-0199');
  const [simCourierNotes, setSimCourierNotes] = useState('Equipped with luxury climate-controlled security transit container.');

  const addSimLog = (message: string) => {
    const timeStr = new Date().toLocaleTimeString();
    setSimLogs(prev => [`[${timeStr}] ${message}`, ...prev].slice(0, 50));
  };

  // Auto-Pilot Timer Effect
  useEffect(() => {
    if (!autoPilotActive || !selectedSimOrderId) return;

    addSimLog(`🚀 Auto-Pilot simulation activated for Order #${selectedSimOrderId.split('-').pop()}. Speed: ${autoPilotSpeed}s/step.`);

    const interval = setInterval(() => {
      setOrders(prevOrders => {
        const order = prevOrders.find(o => o.id === selectedSimOrderId);
        if (!order) {
          addSimLog(`⚠️ Order ${selectedSimOrderId} not found. Deactivating Auto-Pilot.`);
          setAutoPilotActive(false);
          return prevOrders;
        }

        if (order.status === 'delivered') {
          addSimLog(`✅ Order ${selectedSimOrderId} has reached final state (Delivered). Sim completed!`);
          setAutoPilotActive(false);
          playAlertSound();
          return prevOrders;
        }

        if (order.status === 'cancelled') {
          addSimLog(`❌ Order ${selectedSimOrderId} is Cancelled. Deactivating Auto-Pilot.`);
          setAutoPilotActive(false);
          return prevOrders;
        }

        // Determine next status
        let nextStatus: OrderStatus = 'confirmed';
        if (order.status === 'pending') nextStatus = 'confirmed';
        else if (order.status === 'confirmed') nextStatus = 'preparing';
        else if (order.status === 'preparing' || order.status === 'cooking') nextStatus = 'ready';
        else if (order.status === 'ready') nextStatus = 'out_for_delivery';
        else if (order.status === 'out_for_delivery' || order.status === 'dispatched') nextStatus = 'delivered';

        addSimLog(`⚙️ Auto-Pilot: Transitioning ${order.id} status to "${nextStatus.toUpperCase()}"`);
        
        const updatedOrder = {
          ...order,
          status: nextStatus,
          courierName: simCourierName,
          courierPhone: simCourierPhone,
          courierNotes: simCourierNotes
        };

        addToast(`Simulated Order #${order.id.split('-').pop()} is now ${nextStatus.toUpperCase()}`, 'info');

        return prevOrders.map(o => o.id === selectedSimOrderId ? updatedOrder : o);
      });
    }, autoPilotSpeed * 1000);

    return () => clearInterval(interval);
  }, [autoPilotActive, selectedSimOrderId, autoPilotSpeed, simCourierName, simCourierPhone, simCourierNotes]);

  const handleManualAdvance = (status: OrderStatus) => {
    if (!selectedSimOrderId) return;
    
    setOrders(prevOrders => {
      const order = prevOrders.find(o => o.id === selectedSimOrderId);
      if (!order) return prevOrders;
      
      const updatedOrder = {
        ...order,
        status,
        courierName: simCourierName,
        courierPhone: simCourierPhone,
        courierNotes: simCourierNotes
      };
      
      addSimLog(`🔧 Manual Update: Forced status of ${order.id} to "${status.toUpperCase()}" (Driver: ${simCourierName})`);
      addToast(`Order status manually set to: ${status.toUpperCase()}`, 'success');
      return prevOrders.map(o => o.id === selectedSimOrderId ? updatedOrder : o);
    });
  };

  const handleSimulateCheckout = (presetType: 'brunch' | 'wagyu' | 'caviar' | 'random') => {
    const timeId = Date.now();
    const orderId = `LES-SIM-${timeId.toString().substring(8)}`;
    
    const customersList = [
      { name: 'Lady Penelope Vandeleur', phone: '+1 (555) 302-9842', address: '42 Belgrave Square, Belgravia, London' },
      { name: 'Sir Alistair Sterling', phone: '+1 (555) 902-1823', address: '75 Rue du Faubourg Saint-Honoré, Paris' },
      { name: 'Duchess Beatrice Montgomery', phone: '+1 (555) 728-9012', address: '1008 Fifth Avenue, Upper East Side, New York' },
      { name: 'Lord Sebastian Ravenscroft', phone: '+1 (555) 438-1104', address: 'The Shard Penthouse, London Bridge, London' },
      { name: 'Baroness Vivienne Westwood', phone: '+1 (555) 129-8873', address: '88 Royal Crescent, Bath, Somerset' },
      { name: 'Viscount Charles Harrington', phone: '+1 (555) 883-9201', address: '36 Villa de Montmorency, Auteuil, Paris' }
    ];
    const chosenCust = customersList[Math.floor(Math.random() * customersList.length)];
    
    let itemsToOrder: any[] = [];
    
    if (presetType === 'brunch') {
      const croissant = products.find(p => p.name.includes('Croissant')) || {
        id: 'prod-fallback-croissant',
        name: 'Golden Pistachio Croissant',
        price: 12.00,
        description: 'Flaky pastry.',
        category: 'Artisanal Desserts',
        image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=200'
      };
      const coffee = products.find(p => p.category.includes('Drinks')) || {
        id: 'prod-fallback-coffee',
        name: 'Artisanal Café au Lait',
        price: 9.00,
        description: 'Brewed premium roast.',
        category: 'Drinks',
        image: ''
      };
      itemsToOrder = [
        { product: croissant, quantity: 2 },
        { product: coffee, quantity: 2 }
      ];
    } else if (presetType === 'wagyu') {
      const wagyu = products.find(p => p.name.includes('Ribeye') || p.name.includes('Wagyu')) || {
        id: 'prod-fallback-wagyu',
        name: 'Truffle Ribeye Filet Mignon',
        price: 89.00,
        description: 'Prime dry-aged ribeye.',
        category: 'Signature Mains',
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=200'
      };
      const starter = products.find(p => p.name.includes('Lobster') || p.name.includes('Starter')) || {
        id: 'prod-fallback-lobster',
        name: 'Maine Lobster Tail',
        price: 45.00,
        description: 'Poached lobster tail.',
        category: 'Gourmet Starters',
        image: 'https://images.unsplash.com/photo-1553618551-fba689030290?auto=format&fit=crop&q=80&w=200'
      };
      itemsToOrder = [
        { product: wagyu, quantity: 2 },
        { product: starter, quantity: 1 }
      ];
    } else if (presetType === 'caviar') {
      const caviar = products.find(p => p.name.includes('Caviar')) || {
        id: 'prod-fallback-caviar',
        name: 'Beluga Caviar Reserve',
        price: 250.00,
        description: 'Rare heritage sturgeon caviar.',
        category: 'Caviar Selection',
        image: 'https://images.unsplash.com/photo-1553618551-fba689030290?auto=format&fit=crop&q=80&w=200'
      };
      const wine = products.find(p => p.name.includes('Champagne') || p.name.includes('Wine') || p.name.includes('Pérignon')) || {
        id: 'prod-fallback-wine',
        name: 'Dom Pérignon Vintage',
        price: 180.00,
        description: 'Prestigious vintage Champagne.',
        category: 'Drinks',
        image: ''
      };
      itemsToOrder = [
        { product: caviar, quantity: 1 },
        { product: wine, quantity: 1 }
      ];
    } else {
      const count = Math.floor(Math.random() * 3) + 1;
      const menuItems = products.length > 0 ? products : [
        { id: 'fallback-1', name: 'Truffle Ribeye Filet Mignon', price: 89.00, category: 'Signature Mains' },
        { id: 'fallback-2', name: 'Golden Pistachio Croissant', price: 12.00, category: 'Artisanal Desserts' },
        { id: 'fallback-3', name: 'Maine Lobster Tail', price: 45.00, category: 'Gourmet Starters' }
      ];
      for (let i = 0; i < count; i++) {
        const randProduct = menuItems[Math.floor(Math.random() * menuItems.length)];
        const qty = Math.floor(Math.random() * 2) + 1;
        if (!itemsToOrder.some(it => it.product.id === randProduct.id)) {
          itemsToOrder.push({ product: randProduct, quantity: qty });
        }
      }
    }
    
    const subtotal = itemsToOrder.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const deliveryFee = subtotal > 150 ? 0 : 15.00;
    const tipAmount = Math.random() > 0.5 ? (subtotal > 150 ? 50.00 : 20.00) : 10.00;
    const discount = 0.00;
    const total = subtotal + deliveryFee + tipAmount - discount;
    
    const newOrder: Order = {
      id: orderId,
      customerName: chosenCust.name,
      phone: chosenCust.phone,
      address: chosenCust.address,
      items: itemsToOrder,
      subtotal,
      deliveryFee,
      tipAmount,
      discount,
      total,
      status: 'pending',
      timestamp: new Date().toISOString(),
      paymentMethod: 'Prepaid (Vault Express)',
      notes: 'Please dispatch with room-temperature cloche coverage.'
    };
    
    setOrders(prev => [newOrder, ...prev]);
    setSelectedSimOrderId(orderId);
    
    addSimLog(`🛒 Created simulated customer checkout for ${chosenCust.name}. Order ID: ${orderId} Total: $${total.toFixed(2)}`);
    addToast(`[Simulated Order] #${orderId.substring(8)} placed by ${chosenCust.name}!`, 'success');
    playAlertSound();
  };

  // Sidebar Configuration list (Contains all requested module names and icons)
  const SIDEBAR_ITEMS = [
    { id: 'overview', label: 'Dashboard Overview', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'orders', label: 'Orders', icon: <ShoppingBag className="w-4 h-4" />, count: orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length },
    { id: 'menu', label: 'Menu Management', icon: <Eye className="w-4 h-4" /> },
    { id: 'categories', label: 'Categories', icon: <Menu className="w-4 h-4" /> },
    { id: 'addons', label: 'Addons', icon: <Sliders className="w-4 h-4" /> },
    { id: 'offers', label: 'Offers', icon: <Percent className="w-4 h-4" /> },
    { id: 'customers', label: 'Customers', icon: <Users className="w-4 h-4" /> },
    { id: 'reviews', label: 'Reviews', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'reports', label: 'Analytics', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'settings', label: 'Restaurant Settings', icon: <Settings className="w-4 h-4" /> },
    { id: 'simulator', label: 'Simulator Tools', icon: <Truck className="w-4 h-4 text-orange-400 animate-pulse" /> }
  ];

  // Accent Colors Mapping list
  const COLOR_PALETTE = [
    { id: 'amber', name: 'Amber Gold', hex: '#f59e0b', bg: 'bg-amber-500' },
    { id: 'indigo', name: 'Royal Indigo', hex: '#4f46e5', bg: 'bg-indigo-600' },
    { id: 'emerald', name: 'Emerald Mint', hex: '#10b981', bg: 'bg-emerald-500' },
    { id: 'rose', name: 'Velvet Rose', hex: '#e11d48', bg: 'bg-rose-600' },
    { id: 'purple', name: 'Electric Violet', hex: '#9333ea', bg: 'bg-purple-600' }
  ];

  // ==========================================
  // HANDLERS
  // ==========================================
  
  // Add a brand-new dish
  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice) {
      addToast('Please input dish name and price', 'error');
      return;
    }
    const newId = `prod-${Date.now()}`;
    const newProduct: Product = {
      id: newId,
      name: newProdName,
      description: newProdDesc || 'An exquisite, masterfully prepared culinary selection.',
      price: parseFloat(newProdPrice),
      category: newProdCategory,
      image: newProdImage,
      rating: 5.0,
      reviewsCount: 1,
      prepTime: 15,
      tags: newProdTags.split(',').map(t => t.trim()),
      available: true,
      isNewArrival: true,
    };

    setProducts(prev => [newProduct, ...prev]);
    addToast(`"${newProdName}" added to client menu!`, 'success');
    
    // Reset Form
    setNewProdName('');
    setNewProdPrice('');
    setNewProdDesc('');
    setIsNewProductModalOpen(false);
  };

  // Toggle dish availability
  const toggleProductAvailability = (prodId: string) => {
    setProducts(prev => prev.map(p => {
      if (p.id === prodId) {
        const nextState = !p.available;
        addToast(`Dish availability updated: ${nextState ? 'In Stock' : 'Out of Stock'}`, 'info');
        return { ...p, available: nextState };
      }
      return p;
    }));
  };

  // Delete product
  const handleDeleteProduct = (prodId: string, name: string) => {
    setProducts(prev => prev.filter(p => p.id !== prodId));
    addToast(`"${name}" removed from menu!`, 'warning');
  };

  // Reply to review
  const handleReviewReply = (revId: string) => {
    const text = reviewReplyState[revId];
    if (!text || !text.trim()) return;

    setReviews(prev => prev.map(r => {
      if (r.id === revId) {
        return { ...r, replyText: text };
      }
      return r;
    }));

    addToast('Response posted successfully!', 'success');
    setReviewReplyState(prev => ({ ...prev, [revId]: '' }));
  };

  // Update live order status
  const updateOrderStatus = (orderId: string, nextStatus: OrderStatus) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        addToast(`Order #${orderId.substring(4)} status updated to: ${nextStatus.toUpperCase()}`, 'success');
        return { ...o, status: nextStatus };
      }
      return o;
    }));
  };

  // Create new coupon
  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode || !newVal) {
      addToast('Please enter code and value', 'error');
      return;
    }
    const newC: Coupon = {
      id: `coupon-${Date.now()}`,
      code: newCode.toUpperCase().replace(/\s/g, ''),
      type: newType,
      value: parseFloat(newVal),
      minSpend: newMinSpend ? parseFloat(newMinSpend) : 0,
      active: true,
      uses: 0
    };

    setCoupons(prev => [newC, ...prev]);
    // Also add to offers carousel
    const newOffer: Offer = {
      id: `off-coupon-${Date.now()}`,
      title: `${newC.type === 'percentage' ? newC.value + '%' : '$' + newC.value} Discount Offer`,
      description: `Input code ${newC.code} at checkout to claim.`,
      code: newC.code,
      type: newC.type === 'percentage' ? 'percentage' : 'limited',
      value: newC.type === 'percentage' ? `${newC.value}%` : `$${newC.value}`,
      expiresAt: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
      badgeText: 'Active Coupon'
    };
    setOffers(prev => [newOffer, ...prev]);

    addToast(`Coupon "${newC.code}" is now live!`, 'success');
    setNewCode('');
    setNewVal('');
    setNewMinSpend('');
  };

  // Toggle Coupon Active Status
  const toggleCouponStatus = (couponId: string, code: string) => {
    setCoupons(prev => prev.map(c => {
      if (c.id === couponId) {
        const nextState = !c.active;
        addToast(`Coupon "${code}" is now ${nextState ? 'enabled' : 'disabled'}`, 'info');
        return { ...c, active: nextState };
      }
      return c;
    }));
  };

  // Trigger test sound
  const playAlertSound = () => {
    addToast('Playing test beep alert...', 'info');
    // Simple Web Audio synthesis to avoid broken static audio references
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // Pitch A5
      gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.15);
    } catch (err) {
      console.log('Audio Context not allowed by browser guidelines yet');
    }
  };

  return (
    <div className="bg-slate-950 text-white min-h-[85vh] rounded-3xl border border-white/10 overflow-hidden shadow-2xl flex flex-col md:flex-row">
      
      {/* -------------------------------------------
          ADMIN CONSOLE LEFT SIDEBAR NAVIGATION
         ------------------------------------------- */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/10 bg-slate-900/60 p-4 shrink-0 flex flex-col justify-between">
        <div className="space-y-5">
          <div className="px-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">
              SaaS Administration
            </span>
            <h3 className="font-display font-black text-white text-base flex items-center gap-1.5">
              <Sliders className="w-4.5 h-4.5 text-amber-400" />
              Merchant Hub
            </h3>
          </div>

          <nav className="space-y-1">
            {SIDEBAR_ITEMS.map((item) => {
              const active = activeModule === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveModule(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer outline-none ${
                    active
                      ? 'bg-amber-500 text-slate-950 shadow-md scale-[1.02]'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={active ? 'text-slate-950' : 'text-slate-400'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  {item.count !== undefined && item.count > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-black ${
                      active ? 'bg-slate-950 text-amber-400' : 'bg-amber-400 text-slate-950 animate-pulse'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Console footer metadata */}
        <div className="pt-6 border-t border-white/5 px-2 space-y-4">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-slate-950 border border-amber-500/20 hover:border-amber-400 outline-none"
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>Go to Customer Site</span>
          </button>

          {onLogout && (
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-slate-950 border border-rose-500/20 hover:border-rose-400 outline-none"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out Console</span>
            </button>
          )}

          <div className="hidden md:block">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Tenant Active
              </span>
            </div>
            <span className="text-[9px] text-slate-500 font-mono block mt-1">
              Build v2.4.0 (SaaS Engine)
            </span>
          </div>
        </div>
      </aside>

      {/* -------------------------------------------
          ADMIN CONSOLE RIGHT WORKSPACE AREA
         ------------------------------------------- */}
      <main className="flex-1 p-5 md:p-7 min-w-0 bg-slate-950 relative overflow-y-auto max-h-[85vh]">
        
        {/* Module Header Title */}
        <div className="border-b border-white/10 pb-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">
              L’Étoile Gastronomique Administration
            </span>
            <h2 className="font-display font-black text-white text-xl tracking-tight uppercase">
              {SIDEBAR_ITEMS.find(i => i.id === activeModule)?.label}
            </h2>
          </div>

          {/* Top Quick Actions widget */}
          <div className="flex items-center gap-2">
            <Badge variant="primary" className="font-mono">
              Role: System Administrator
            </Badge>
          </div>
        </div>

        {/* -------------------------------------------
            1. MODULE: DASHBOARD OVERVIEW
           ------------------------------------------- */}
        {/* -------------------------------------------
            1. MODULE: DASHBOARD OVERVIEW
           ------------------------------------------- */}
        {activeModule === 'overview' && (() => {
          // Calculate realistic live data
          const totalOrders = orders.length + 15; // 15 historical + live checkouts
          const liveRevenue = orders.reduce((sum, o) => o.status !== 'cancelled' ? sum + o.total : sum, 0);
          const revenueValue = 14582.40 + liveRevenue;
          const pendingCount = orders.filter(o => o.status === 'pending').length;
          const completedCount = orders.filter(o => o.status === 'delivered').length + 142; // 142 historical + live delivered

          return (
            <div className="space-y-6 text-left">
              {/* Quick Metrics Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card variant="standard" className="p-4 space-y-1 bg-slate-900/50 border border-white/10 hover:border-amber-500/20 transition-all duration-300">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block">Today's Orders</span>
                  <h4 className="text-xl md:text-2xl font-black text-white font-mono flex items-center">
                    <ShoppingBag className="w-5 h-5 text-amber-400 mr-1.5 shrink-0" />
                    {totalOrders}
                  </h4>
                  <span className="text-[10px] text-emerald-400 font-bold block">
                    +18.3% vs yesterday
                  </span>
                </Card>

                <Card variant="standard" className="p-4 space-y-1 bg-slate-900/50 border border-white/10 hover:border-emerald-500/20 transition-all duration-300">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block">Revenue</span>
                  <h4 className="text-xl md:text-2xl font-black text-white font-mono flex items-center">
                    <DollarSign className="w-5 h-5 text-emerald-400 shrink-0" />
                    {revenueValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </h4>
                  <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" /> +14.2% peak
                  </span>
                </Card>

                <Card variant="standard" className="p-4 space-y-1 bg-slate-900/50 border border-white/10 hover:border-indigo-500/20 transition-all duration-300">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block">Pending Orders</span>
                  <h4 className="text-xl md:text-2xl font-black text-white font-mono flex items-center">
                    <Clock className="w-5 h-5 text-indigo-400 mr-1.5 shrink-0" />
                    {pendingCount} Active
                  </h4>
                  <span className="text-[10px] text-indigo-400 font-bold block">
                    ● Dispatch pipeline live
                  </span>
                </Card>

                <Card variant="standard" className="p-4 space-y-1 bg-slate-900/50 border border-white/10 hover:border-emerald-500/20 transition-all duration-300">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block">Completed Orders</span>
                  <h4 className="text-xl md:text-2xl font-black text-white font-mono flex items-center">
                    <Check className="w-5 h-5 text-emerald-400 mr-1.5 shrink-0" />
                    {completedCount}
                  </h4>
                  <span className="text-[10px] text-emerald-400 font-bold block">
                    98.4% success rate
                  </span>
                </Card>
              </div>

              {/* Layout Grid: Sales Chart + Popular Categories */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sales Chart */}
                <div className="lg:col-span-2 bg-white/[0.02] border border-white/10 rounded-3xl p-5 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest block">Hourly Revenue Performance Curve</span>
                    <span className="text-xs font-bold text-emerald-400 font-mono">$1,840.00 Peak hour</span>
                  </div>
                  
                  {/* Premium inline SVG Line Chart */}
                  <div className="h-44 w-full relative">
                    <svg className="w-full h-full" viewBox="0 0 500 100" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      
                      {/* Grid lines */}
                      <line x1="0" y1="25" x2="500" y2="25" stroke="rgba(255,255,255,0.05)" strokeDasharray="5" />
                      <line x1="0" y1="50" x2="500" y2="50" stroke="rgba(255,255,255,0.05)" strokeDasharray="5" />
                      <line x1="0" y1="75" x2="500" y2="75" stroke="rgba(255,255,255,0.05)" strokeDasharray="5" />
                      
                      {/* Revenue Area */}
                      <path
                        d="M0 100 L 0 85 L 50 65 L 100 80 L 150 40 L 200 55 L 250 20 L 300 35 L 350 15 L 400 60 L 450 30 L 500 10 L 500 100 Z"
                        fill="url(#chartGrad)"
                      />
                      
                      {/* Revenue Line */}
                      <path
                        d="M0 85 L 50 65 L 100 80 L 150 40 L 200 55 L 250 20 L 300 35 L 350 15 L 400 60 L 450 30 L 500 10"
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                      
                      {/* Data Points */}
                      <circle cx="250" cy="20" r="4" fill="#ffffff" stroke="#f59e0b" strokeWidth="2" />
                      <circle cx="350" cy="15" r="4" fill="#ffffff" stroke="#f59e0b" strokeWidth="2" />
                      <circle cx="500" cy="10" r="4" fill="#ffffff" stroke="#f59e0b" strokeWidth="2" />
                    </svg>
                  </div>
                  <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                    <span>12:00 PM</span>
                    <span>2:00 PM</span>
                    <span>4:00 PM</span>
                    <span>6:00 PM</span>
                    <span>8:00 PM (Peak)</span>
                    <span>10:00 PM</span>
                  </div>
                </div>

                {/* Popular Categories */}
                <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-5 space-y-4">
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest block mb-1">Popular Categories</span>
                  <div className="space-y-3">
                    {[
                      { name: 'Signature Mains', percentage: 45, color: 'bg-amber-500' },
                      { name: 'Gourmet Starters', percentage: 25, color: 'bg-indigo-500' },
                      { name: 'Artisanal Desserts', percentage: 18, color: 'bg-purple-500' },
                      { name: 'Caviar Selection', percentage: 12, color: 'bg-rose-500' },
                    ].map((cat, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-300 font-medium">{cat.name}</span>
                          <span className="font-mono text-white font-bold">{cat.percentage}%</span>
                        </div>
                        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                          <div className={`h-full ${cat.color} rounded-full`} style={{ width: `${cat.percentage}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Layout Grid: Best Selling Products + Recent Orders */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Best Selling Products */}
                <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-5 space-y-4">
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest block mb-1">Best Selling Products</span>
                  <div className="divide-y divide-white/5 space-y-3">
                    {[
                      { name: 'Truffle Ribeye Filet', category: 'Signature Mains', sales: 148, revenue: 8732.00, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=200' },
                      { name: 'Golden Pistachio Croissant', category: 'Artisanal Desserts', sales: 94, revenue: 1128.00, image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=200' },
                      { name: 'Maine Lobster Tail', category: 'Gourmet Starters', sales: 76, revenue: 3420.00, image: 'https://images.unsplash.com/photo-1553618551-fba689030290?auto=format&fit=crop&q=80&w=200' },
                    ].map((prod, idx) => (
                      <div key={idx} className="pt-3 first:pt-0 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img src={prod.image} alt={prod.name} className="w-10 h-10 rounded-xl object-cover border border-white/10 bg-white/5" />
                          <div>
                            <h5 className="font-bold text-xs text-white leading-tight">{prod.name}</h5>
                            <span className="text-[9px] text-slate-400 uppercase tracking-wide">{prod.category}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-bold text-white font-mono block">{prod.sales} sold</span>
                          <span className="text-[10px] text-emerald-400 font-mono">${prod.revenue.toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-5 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest block">Recent Orders</span>
                    <button onClick={() => setActiveModule('orders')} className="text-[10px] text-amber-400 font-bold uppercase tracking-wider hover:underline cursor-pointer">
                      View All ➔
                    </button>
                  </div>
                  <div className="divide-y divide-white/5 space-y-3">
                    {orders.slice(0, 3).map((order) => (
                      <div key={order.id} className="pt-3 first:pt-0 flex items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-white font-mono">{order.id}</span>
                            <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded ${
                              order.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                              order.status === 'cancelled' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                              'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 block mt-0.5">{order.customerName} • {order.items.length} items</span>
                        </div>
                        <span className="font-mono text-xs font-bold text-amber-400">${order.total.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* -------------------------------------------
            2. MODULE: ORDERS QUEUE (Interactive Live Queue)
           ------------------------------------------- */}
        {activeModule === 'orders' && (
          <div className="space-y-6 text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <span className="text-xs text-slate-400">
                Manage, prepare, and route customer orders. Update order statuses to notify clients instantly. Prepared for Supabase real-time sync.
              </span>
              <div className="flex items-center gap-2">
                <Badge variant="primary" className="font-mono">
                  {orders.length} Total Orders
                </Badge>
              </div>
            </div>

            {orders.length === 0 ? (
              <Card variant="standard" className="py-12 text-center text-slate-400 border border-white/10 bg-slate-900/40">
                <ShoppingBag className="w-10 h-10 mx-auto text-slate-500 mb-2" />
                No orders placed in the system yet.
              </Card>
            ) : (
              <div className="overflow-x-auto rounded-[1.5rem] border border-white/10 bg-slate-950/40 backdrop-blur-md">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5 uppercase tracking-wider text-[10px] text-slate-400 font-bold font-mono">
                      <th className="p-4">Order ID</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Phone & Address</th>
                      <th className="p-4">Ordered Items</th>
                      <th className="p-4">Total Price</th>
                      <th className="p-4">Payment</th>
                      <th className="p-4">Order Time</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Quick Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {orders.map((order) => {
                      const statusMap: { [key: string]: { label: string, badge: string } } = {
                        pending: { label: 'Pending', badge: 'bg-amber-500/10 text-amber-300 border border-amber-500/30' },
                        confirmed: { label: 'Confirmed', badge: 'bg-sky-500/10 text-sky-300 border border-sky-500/30' },
                        preparing: { label: 'Preparing', badge: 'bg-yellow-500/10 text-yellow-300 border border-yellow-500/30' },
                        cooking: { label: 'Preparing', badge: 'bg-yellow-500/10 text-yellow-300 border border-yellow-500/30' },
                        ready: { label: 'Ready', badge: 'bg-purple-500/10 text-purple-300 border border-purple-500/30' },
                        out_for_delivery: { label: 'Out for Delivery', badge: 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/30' },
                        dispatched: { label: 'Out for Delivery', badge: 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/30' },
                        delivered: { label: 'Delivered', badge: 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30' },
                        cancelled: { label: 'Cancelled', badge: 'bg-rose-500/10 text-rose-300 border border-rose-500/30' }
                      };

                      const currentStatusConfig = statusMap[order.status] || { label: order.status, badge: 'bg-white/5 text-slate-300 border border-white/10' };

                      return (
                        <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                          {/* Order ID */}
                          <td className="p-4 font-mono font-bold text-white whitespace-nowrap">
                            {order.id}
                          </td>
                          
                          {/* Customer Name */}
                          <td className="p-4 font-bold text-white whitespace-nowrap">
                            {order.customerName}
                          </td>

                          {/* Phone & Address */}
                          <td className="p-4 max-w-[200px]">
                            <div className="space-y-1">
                              <span className="text-[11px] text-slate-300 font-mono block">{order.phone || '+1 (555) 902-8371'}</span>
                              <span className="text-[10px] text-slate-400 block line-clamp-1 hover:line-clamp-none transition-all" title={order.address}>
                                {order.address}
                              </span>
                            </div>
                          </td>

                          {/* Ordered Items */}
                          <td className="p-4 max-w-[240px]">
                            <div className="space-y-1">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="text-[11px] text-slate-300 flex items-center gap-1.5">
                                  <span className="bg-white/10 px-1.5 py-0.2 rounded text-[9px] font-mono text-white font-bold">{item.quantity}x</span>
                                  <span className="truncate">{item.product.name}</span>
                                </div>
                              ))}
                              {order.notes && (
                                <p className="text-[10px] text-amber-300 italic truncate" title={order.notes}>
                                  Note: "{order.notes}"
                                </p>
                              )}
                            </div>
                          </td>

                          {/* Total Price */}
                          <td className="p-4 font-mono font-bold text-amber-400 whitespace-nowrap">
                            ${order.total.toFixed(2)}
                          </td>

                          {/* Payment Method */}
                          <td className="p-4 font-mono text-slate-300 whitespace-nowrap">
                            {order.paymentMethod || 'Apple Pay'}
                          </td>

                          {/* Order Time */}
                          <td className="p-4 text-slate-300 font-mono whitespace-nowrap">
                            {new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>

                          {/* Order Status (Select menu) */}
                          <td className="p-4">
                            <div className="flex flex-col gap-1.5">
                              <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full inline-block text-center w-max ${currentStatusConfig.badge}`}>
                                {currentStatusConfig.label}
                              </span>
                              <select
                                value={order.status === 'cooking' ? 'preparing' : order.status === 'dispatched' ? 'out_for_delivery' : order.status}
                                onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                                className="bg-slate-950/80 border border-white/10 rounded-xl px-2.5 py-1.5 text-[11px] font-bold text-white outline-none focus:border-amber-500/40 cursor-pointer min-w-[130px]"
                              >
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="preparing">Preparing</option>
                                <option value="ready">Ready</option>
                                <option value="out_for_delivery">Out for Delivery</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </div>
                          </td>

                          {/* Quick action triggers */}
                          <td className="p-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              {order.status === 'pending' && (
                                <button
                                  onClick={() => updateOrderStatus(order.id, 'confirmed')}
                                  className="px-2 py-1 rounded bg-sky-500 text-slate-950 font-bold text-[10px] uppercase hover:bg-sky-400 transition-colors cursor-pointer animate-pulse"
                                >
                                  Confirm
                                </button>
                              )}
                              {(order.status === 'confirmed' || order.status === 'pending') && (
                                <button
                                  onClick={() => updateOrderStatus(order.id, 'preparing')}
                                  className="px-2 py-1 rounded bg-yellow-500 text-slate-950 font-bold text-[10px] uppercase hover:bg-yellow-400 transition-colors cursor-pointer"
                                >
                                  Prepare
                                </button>
                              )}
                              {(order.status === 'preparing' || order.status === 'cooking') && (
                                <button
                                  onClick={() => updateOrderStatus(order.id, 'ready')}
                                  className="px-2 py-1 rounded bg-purple-500 text-white font-bold text-[10px] uppercase hover:bg-purple-400 transition-colors cursor-pointer"
                                >
                                  Ready
                                </button>
                              )}
                              {order.status === 'ready' && (
                                <button
                                  onClick={() => updateOrderStatus(order.id, 'out_for_delivery')}
                                  className="px-2 py-1 rounded bg-indigo-500 text-white font-bold text-[10px] uppercase hover:bg-indigo-400 transition-colors cursor-pointer"
                                >
                                  Dispatch
                                </button>
                              )}
                              {(order.status === 'out_for_delivery' || order.status === 'dispatched') && (
                                <button
                                  onClick={() => updateOrderStatus(order.id, 'delivered')}
                                  className="px-2 py-1 rounded bg-emerald-500 text-slate-950 font-bold text-[10px] uppercase hover:bg-emerald-400 transition-colors cursor-pointer"
                                  title="Complete Deliver"
                                >
                                  Deliver
                                </button>
                              )}
                              {order.status !== 'delivered' && order.status !== 'cancelled' && (
                                <button
                                  onClick={() => updateOrderStatus(order.id, 'cancelled')}
                                  className="px-2 py-1 rounded border border-rose-500/30 text-rose-400 font-bold text-[10px] uppercase hover:bg-rose-950/50 transition-colors cursor-pointer"
                                >
                                  Cancel
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* -------------------------------------------
            3. MODULE: MENU MANAGEMENT (Edit / Add items)
           ------------------------------------------- */}
        {activeModule === 'menu' && (
          <div className="space-y-6 text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <span className="text-xs text-slate-400 max-w-lg">
                Create new masterpieces, delete retired items, toggle stock availability, and update pricing instantaneously.
              </span>
              <Button
                size="sm"
                variant="amber"
                icon={<Plus className="w-4 h-4" />}
                onClick={() => setIsNewProductModalOpen(true)}
              >
                Add Masterpiece
              </Button>
            </div>

            {/* Menu Management List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.map((item) => (
                <Card key={item.id} variant="standard" className="p-4 space-y-4 bg-slate-900/60">
                  <div className="flex gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-2xl object-cover border border-white/10 shrink-0"
                    />
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-sm text-white truncate">{item.name}</h4>
                        <span className="font-mono font-black text-xs text-amber-400 shrink-0">${item.price.toFixed(2)}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{item.description}</p>
                      <div className="flex flex-wrap gap-1 pt-1">
                        <Tag>{item.category}</Tag>
                        {item.isBestseller && <Tag>★ Bestseller</Tag>}
                        {!item.available && <Tag className="text-rose-400 border-rose-500/20">Out of stock</Tag>}
                      </div>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="border-t border-white/5 pt-3 flex justify-between items-center text-xs">
                    <button
                      onClick={() => toggleProductAvailability(item.id)}
                      className={`font-semibold cursor-pointer ${
                        item.available ? 'text-emerald-400 hover:text-emerald-300' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {item.available ? '● Available (In Stock)' : '○ Unavailable (Out of Stock)'}
                    </button>

                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setEditingProduct(item);
                        }}
                        className="text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Edit Price
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(item.id, item.name)}
                        className="text-rose-500 hover:text-rose-400 flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* In-Line Editing Modal Mini overlay */}
            <AnimatePresence>
              {editingProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-slate-900 border border-white/10 rounded-3xl p-6 max-w-sm w-full space-y-4 text-white"
                  >
                    <h3 className="font-display font-bold text-base">Quick Price Update</h3>
                    <p className="text-xs text-slate-400">Modify rate for: <strong>{editingProduct.name}</strong></p>
                    
                    <Input
                      label="New Price ($)"
                      type="number"
                      step="0.01"
                      placeholder={editingProduct.price.toString()}
                      id="edit-price-input"
                    />

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="flex-1"
                        onClick={() => setEditingProduct(null)}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        variant="amber"
                        className="flex-1"
                        onClick={() => {
                          const inputVal = (document.getElementById('edit-price-input') as HTMLInputElement)?.value;
                          if (inputVal) {
                            setProducts(prev => prev.map(p => {
                              if (p.id === editingProduct.id) {
                                return { ...p, price: parseFloat(inputVal) };
                              }
                              return p;
                            }));
                            addToast(`Updated ${editingProduct.name} rate to $${parseFloat(inputVal).toFixed(2)}`, 'success');
                          }
                          setEditingProduct(null);
                        }}
                      >
                        Save Price
                      </Button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* New Product Creator Drawer Modal */}
            <AnimatePresence>
              {isNewProductModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md">
                  <motion.form
                    onSubmit={handleCreateProduct}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-slate-900 border border-white/10 rounded-3xl p-6 max-w-md w-full space-y-4 text-white"
                  >
                    <h3 className="font-display font-black text-white text-lg border-b border-white/5 pb-2">
                      Deploy Brand New Dish
                    </h3>
                    
                    <div className="space-y-3">
                      <Input
                        label="Dish Name"
                        value={newProdName}
                        onChange={(e) => setNewProdName(e.target.value)}
                        placeholder="e.g. Imperial Beluga Caviar Tartlet"
                        required
                      />

                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          label="Price ($)"
                          type="number"
                          step="0.01"
                          value={newProdPrice}
                          onChange={(e) => setNewProdPrice(e.target.value)}
                          placeholder="85.00"
                          required
                        />

                        <div className="text-left space-y-1.5">
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">
                            Category Selection
                          </label>
                          <select
                            value={newProdCategory}
                            onChange={(e) => setNewProdCategory(e.target.value)}
                            className="w-full bg-slate-950 border border-white/10 rounded-2xl px-4 py-3 text-xs font-bold text-white outline-none focus:border-white/20"
                          >
                            <option value="Signature Mains">Signature Mains</option>
                            <option value="Starters & Bites">Starters & Bites</option>
                            <option value="Bakery & Desserts">Bakery & Desserts</option>
                            <option value="Premium Drinks">Premium Drinks</option>
                          </select>
                        </div>
                      </div>

                      <Input
                        label="Description"
                        value={newProdDesc}
                        onChange={(e) => setNewProdDesc(e.target.value)}
                        placeholder="Describe the texture, ingredients, and garnish details..."
                      />

                      <Input
                        label="Custom Tags (comma separated)"
                        value={newProdTags}
                        onChange={(e) => setNewProdTags(e.target.value)}
                        placeholder="Chef Special, Luxury, Rare"
                      />
                    </div>

                    <div className="flex gap-2.5 pt-2">
                      <Button
                        type="button"
                        variant="ghost"
                        className="flex-1"
                        onClick={() => setIsNewProductModalOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="amber"
                        className="flex-1"
                      >
                        Deploy Live Dish
                      </Button>
                    </div>
                  </motion.form>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* -------------------------------------------
            4. MODULE: CATEGORIES
           ------------------------------------------- */}
        {activeModule === 'categories' && (
          <div className="space-y-6 text-left">
            <span className="text-xs text-slate-400 block mb-2">
              Manage platform category taxonomy. Toggle active categories or add custom culinary sections dynamically.
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {['Signature Mains', 'Starters & Bites', 'Bakery & Desserts', 'Premium Drinks'].map((cat) => {
                const count = products.filter(p => p.category === cat).length;
                return (
                  <Card key={cat} variant="standard" className="p-4 space-y-2 bg-slate-900/60 border border-white/10">
                    <h4 className="font-bold text-white text-sm">{cat}</h4>
                    <span className="text-xs text-slate-400 font-mono block">{count} Active Dishes</span>
                    <Badge variant="success">Active on Site</Badge>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* -------------------------------------------
            5. MODULE: ADDONS
           ------------------------------------------- */}
        {activeModule === 'addons' && (
          <div className="space-y-6 text-left">
            <span className="text-xs text-slate-400 block mb-2">
              Upsell and boost transactional checkouts with custom dish modifiers.
            </span>
            <div className="space-y-3">
              {[
                { name: 'Extra Shaved Black Truffle', price: 8.00, desc: 'Add 3g fresh Umbrian black truffle flakes' },
                { name: 'Edible Gold Leaf Garnish', price: 15.00, desc: 'Coat the master dish with 24K edible gold foliage' },
                { name: 'Saffron Velvet Infused Sauce', price: 5.50, desc: 'Drizzle with rare Kashmiri saffron reduction' },
                { name: '10g Imperial Ossetra Caviar Spoon', price: 35.00, desc: 'Served on mother-of-pearl spoon' }
              ].map((addon) => (
                <div key={addon.name} className="flex justify-between items-center p-4 bg-white/5 border border-white/5 rounded-2xl">
                  <div>
                    <h4 className="text-xs font-bold text-white">{addon.name}</h4>
                    <p className="text-[10px] text-slate-400">{addon.desc}</p>
                  </div>
                  <span className="text-xs font-mono font-black text-amber-400">+${addon.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* -------------------------------------------
            6. MODULE: CUSTOMERS CRM
           ------------------------------------------- */}
        {activeModule === 'customers' && (
          <div className="space-y-6 text-left overflow-x-auto">
            <span className="text-xs text-slate-400 block mb-2">
              Track premium repeat clients, aggregate high-value account histories, and view customer directories.
            </span>

            <table className="w-full text-xs text-left text-slate-300 min-w-[500px]">
              <thead className="bg-white/5 uppercase text-[9px] font-bold text-slate-400 tracking-wider">
                <tr>
                  <th className="p-3">Customer Client</th>
                  <th className="p-3">Email Access</th>
                  <th className="p-3">Orders</th>
                  <th className="p-3">LTV Spend</th>
                  <th className="p-3">Member Since</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-white/[0.02]">
                    <td className="p-3 flex items-center gap-3 font-bold text-white">
                      <Avatar name={c.name} size="sm" />
                      {c.name}
                    </td>
                    <td className="p-3 font-mono text-slate-400">{c.email}</td>
                    <td className="p-3 font-mono font-bold">{c.ordersCount} orders</td>
                    <td className="p-3 font-mono text-emerald-400 font-extrabold">${c.totalSpent.toFixed(2)}</td>
                    <td className="p-3 text-slate-400">{c.joinDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* -------------------------------------------
            7. MODULE: REVIEWS (Manage review replies)
           ------------------------------------------- */}
        {activeModule === 'reviews' && (
          <div className="space-y-6 text-left">
            <span className="text-xs text-slate-400 block mb-2">
              Respond directly as the Chef de Cuisine to incoming reviews. Replies instantly bind below reviews on the user-facing app tab.
            </span>

            <div className="space-y-4">
              {reviews.map((rev) => (
                <Card key={rev.id} variant="standard" className="bg-slate-900/60 p-4 space-y-3">
                  <div className="flex gap-3 justify-between">
                    <div className="flex gap-3">
                      <Avatar src={rev.avatar} name={rev.author} size="sm" />
                      <div>
                        <h4 className="font-bold text-xs text-white">{rev.author}</h4>
                        <div className="flex gap-1.5 text-amber-400 mt-0.5">
                          {Array.from({ length: rev.rating }).map((_, idx) => (
                            <span key={idx}>★</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">{rev.date}</span>
                  </div>

                  <p className="text-xs text-slate-300 italic">"{rev.text}"</p>

                  {/* Reply Log */}
                  {rev.replyText ? (
                    <div className="bg-amber-500/10 border border-amber-500/15 p-3 rounded-xl text-xs space-y-1">
                      <strong className="text-amber-400 text-[10px] uppercase tracking-wider block">↳ Response from Chef de Cuisine</strong>
                      <p className="text-slate-200">{rev.replyText}</p>
                    </div>
                  ) : (
                    <div className="space-y-2 pt-2">
                      <Input
                        placeholder="Type premium owner response (e.g. Thanks Clara, Chef Pierre was thrilled!)"
                        value={reviewReplyState[rev.id] || ''}
                        onChange={(e) => setReviewReplyState(prev => ({ ...prev, [rev.id]: e.target.value }))}
                      />
                      <Button
                        size="sm"
                        variant="amber"
                        onClick={() => handleReviewReply(rev.id)}
                      >
                        Publish Reply
                      </Button>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* -------------------------------------------
            8. MODULE: OFFERS & CAMPAIGNS
           ------------------------------------------- */}
        {activeModule === 'offers' && (
          <div className="space-y-8 text-left">
            <div>
              <span className="text-xs text-slate-400 block mb-2">
                Manage high-converting promotional banners, checkout coupons, and limited-time marketing campaigns.
              </span>
            </div>

            {/* Carousel Promotions Manager */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Percent className="w-4 h-4 text-amber-400" /> Active Carousel Promotions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {offers.map((offer) => (
                  <Card key={offer.id} variant="standard" className="p-5 border border-white/10 bg-slate-900/60 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide">
                          {offer.badgeText}
                        </span>
                        <Badge variant={offer.active !== false ? 'success' : 'neutral'}>
                          {offer.active !== false ? 'Live' : 'Inactive'}
                        </Badge>
                      </div>
                      <h4 className="font-display font-bold text-white text-base">{offer.title}</h4>
                      <p className="text-slate-300 text-xs leading-relaxed">{offer.description}</p>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-2">
                        <span>Code: <strong className="text-white bg-slate-950 px-1.5 py-0.5 rounded">{offer.code}</strong></span>
                        <span>•</span>
                        <span>Expires: {offer.expiresAt}</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => {
                        setOffers(prev => prev.map(o => {
                          if (o.id === offer.id) {
                            const nextActive = o.active === false ? true : false;
                            addToast(`Promotion "${offer.title}" ${nextActive ? 'activated' : 'deactivated'}`, 'info');
                            return { ...o, active: nextActive };
                          }
                          return o;
                        }));
                      }}
                      className={`w-full py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                        offer.active !== false
                          ? 'bg-rose-950/40 text-rose-300 border-rose-500/20 hover:bg-rose-950/60'
                          : 'bg-white/10 text-white border-transparent hover:bg-white/15'
                      }`}
                    >
                      {offer.active !== false ? 'Deactivate Banner' : 'Activate Banner'}
                    </button>
                  </Card>
                ))}
              </div>
            </div>

            {/* Campaign Creator Form */}
            <div className="space-y-4 pt-4 border-t border-white/5">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-emerald-400" /> Create Checkout Promo Coupon
              </h3>
              <Card variant="standard" className="p-5 bg-slate-900/40 border border-white/10">
                <form onSubmit={handleCreateCoupon} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
                  <Input
                    label="Promo Code"
                    placeholder="e.g. GRANDFEST"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    required
                  />
                  <Input
                    label="Discount Value"
                    type="number"
                    placeholder="e.g. 25"
                    value={newVal}
                    onChange={(e) => setNewVal(e.target.value)}
                    required
                  />
                  <div className="space-y-1.5 text-left">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Type</label>
                    <select
                      value={newType}
                      onChange={(e: any) => setNewType(e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 rounded-2xl px-4 py-3 text-xs font-bold text-white outline-none focus:border-white/20"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Rate ($)</option>
                    </select>
                  </div>
                  <Button type="submit" variant="amber" className="w-full h-11 cursor-pointer">Deploy Code</Button>
                </form>
              </Card>
            </div>

            {/* Coupons List */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Checkout Coupons Directory</h4>
              <div className="grid grid-cols-1 gap-3">
                {coupons.map((c) => (
                  <div key={c.id} className="flex justify-between items-center p-4 bg-white/[0.02] hover:bg-white/[0.04] border border-white/10 rounded-2xl transition-all">
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-xs text-amber-400 font-mono uppercase tracking-wider bg-amber-500/10 px-2 py-0.5 rounded-lg">{c.code}</strong>
                        <Badge variant={c.active ? 'success' : 'neutral'}>
                          {c.active ? 'Live' : 'Disabled'}
                        </Badge>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">
                        Value: {c.type === 'percentage' ? `${c.value}% Off` : `$${c.value} Off`} | Uses: {c.uses} times
                      </p>
                    </div>

                    <button
                      onClick={() => toggleCouponStatus(c.id, c.code)}
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-bold border transition-all cursor-pointer ${
                        c.active ? 'bg-rose-950 text-rose-400 border-rose-500/20 hover:bg-rose-900/60' : 'bg-white/10 text-white border-transparent hover:bg-white/15'
                      }`}
                    >
                      {c.active ? 'Disable Coupon' : 'Enable Coupon'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* -------------------------------------------
            9. MODULE: DELIVERY SETTINGS
           ------------------------------------------- */}
        {activeModule === 'delivery' && (
          <div className="space-y-6 text-left">
            <span className="text-xs text-slate-400 block mb-2">
              Optimize minimum delivery checkouts, transport charges, and coverage coordinates.
            </span>

            <Card variant="standard" className="p-5 space-y-4 max-w-md bg-slate-900/60">
              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Minimum Order Threshold ($)</label>
                  <Input
                    type="number"
                    value={restaurantInfo.minOrder.toString()}
                    onChange={(e) => setRestaurantInfo(prev => ({ ...prev, minOrder: parseFloat(e.target.value) || 0 }))}
                    placeholder="15.00"
                  />
                  <span className="text-[10px] text-slate-500 font-mono mt-1 block">Prevents checkouts below this value.</span>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Courier Delivery Fee ($)</label>
                  <Input
                    type="number"
                    value={restaurantInfo.deliveryFee.toString()}
                    onChange={(e) => setRestaurantInfo(prev => ({ ...prev, deliveryFee: parseFloat(e.target.value) || 0 }))}
                    placeholder="4.99"
                  />
                  <span className="text-[10px] text-slate-500 font-mono mt-1 block">Charges added to checkouts (complimentary if code FREESHIP is applied).</span>
                </div>
              </div>

              <Button
                size="sm"
                variant="amber"
                onClick={() => addToast('Delivery configurations saved!', 'success')}
              >
                Save Delivery Specs
              </Button>
            </Card>
          </div>
        )}

        {/* -------------------------------------------
            10. MODULE: EMPLOYEES
           ------------------------------------------- */}
        {activeModule === 'employees' && (
          <div className="space-y-6 text-left">
            <span className="text-xs text-slate-400 block mb-2">
              Roster of culinary and dispatch personnel. Manage shift statuses and role privileges.
            </span>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {employees.map((emp) => (
                <Card key={emp.id} variant="standard" className="p-4 flex justify-between items-center bg-slate-900/60">
                  <div className="flex gap-3">
                    <Avatar name={emp.name} size="sm" />
                    <div>
                      <h4 className="font-bold text-xs text-white">{emp.name}</h4>
                      <p className="text-[10px] text-indigo-400 font-mono mt-0.5">{emp.role}</p>
                      <p className="text-[9px] text-slate-500 font-mono">{emp.phone}</p>
                    </div>
                  </div>
                  <Badge variant={emp.status === 'active' ? 'success' : 'neutral'}>
                    {emp.status}
                  </Badge>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* -------------------------------------------
            11. MODULE: NOTIFICATIONS
           ------------------------------------------- */}
        {activeModule === 'notifications' && (
          <div className="space-y-6 text-left">
            <span className="text-xs text-slate-400 block mb-2">
              Configure push notifications, sound test chimes for incoming gourmet orders, and SMS dispatcher alerts.
            </span>

            <Card variant="standard" className="p-5 max-w-md bg-slate-900/60 space-y-4">
              <div className="space-y-3">
                <Checkbox label="Sound chime on incoming culinary order" defaultChecked />
                <Checkbox label="Notify staff on newly posted review" defaultChecked />
                <Checkbox label="Email daily sales report summary" defaultChecked />
                <Checkbox label="Notify private courier when order dispatched" defaultChecked />
              </div>

              <div className="border-t border-white/5 pt-4 space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Acoustic Beep Test</span>
                <p className="text-[11px] text-slate-400">Validate merchant device audio is synchronized for order alarms.</p>
                <Button
                  size="sm"
                  variant="outline"
                  icon={<Volume2 className="w-4 h-4" />}
                  onClick={playAlertSound}
                >
                  Trigger Alarm Test
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* -------------------------------------------
            12. MODULE: REPORTS & ANALYTICS
           ------------------------------------------- */}
        {activeModule === 'reports' && (
          <div className="space-y-6 text-left">
            <span className="text-xs text-slate-400 block mb-2">
              Real-time aggregation of transactional analytics, conversion ratios, and popular categories.
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Report 1 */}
              <Card variant="standard" className="p-5 space-y-3 bg-slate-900/60">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Culinary Category Revenue Share</h4>
                  <span className="text-[10px] text-slate-500 font-mono font-bold">This Month</span>
                </div>

                {/* Simulated Custom Donut/Bar Share Distribution */}
                <div className="space-y-2.5 pt-2">
                  {[
                    { cat: 'Signature Mains', percentage: 65, color: 'bg-amber-500' },
                    { cat: 'Starters & Bites', percentage: 18, color: 'bg-indigo-600' },
                    { cat: 'Bakery & Desserts', percentage: 12, color: 'bg-emerald-500' },
                    { cat: 'Premium Drinks', percentage: 5, color: 'bg-rose-500' }
                  ].map((item) => (
                    <div key={item.cat} className="space-y-1">
                      <div className="flex justify-between text-[11px] font-medium">
                        <span className="text-slate-300">{item.cat}</span>
                        <span className="text-white font-mono">{item.percentage}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
                        <div className={`h-full ${item.color}`} style={{ width: `${item.percentage}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Report 2 */}
              <Card variant="standard" className="p-5 space-y-3 bg-slate-900/60">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Live Traffic Conversion Tunnel</h4>
                  <span className="text-[10px] text-emerald-400 font-bold">Excellent 12.4%</span>
                </div>

                <div className="space-y-2 pt-1 font-mono text-[11px] text-slate-400">
                  <div className="flex justify-between p-2 bg-slate-950/40 rounded-xl">
                    <span>Unique Site Visitors:</span>
                    <strong className="text-white font-bold">2,840</strong>
                  </div>
                  <div className="flex justify-between p-2 bg-slate-950/40 rounded-xl">
                    <span>Added Items to Basket:</span>
                    <strong className="text-white font-bold">842 (29.6%)</strong>
                  </div>
                  <div className="flex justify-between p-2 bg-slate-950/40 rounded-xl">
                    <span>Initiated Checkout:</span>
                    <strong className="text-white font-bold">410 (14.4%)</strong>
                  </div>
                  <div className="flex justify-between p-2 bg-slate-950/40 rounded-xl border border-emerald-500/10">
                    <span className="text-emerald-400">Completed Orders Paid:</span>
                    <strong className="text-emerald-400 font-bold">352 (12.4%)</strong>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* -------------------------------------------
            13. MODULE: RESTAURANT SETTINGS (Dynamic Customization)
           ------------------------------------------- */}
        {activeModule === 'settings' && (
          <div className="space-y-6 text-left">
            <span className="text-xs text-slate-400 block mb-2">
              Branding control panel! Edit name, details, address, and select a custom color accent. Choosing a color instantly overrides all client-facing layouts!
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Dynamic Accent Color Selector */}
              <Card variant="standard" className="p-5 space-y-4 bg-slate-900/60">
                <div className="space-y-1">
                  <h4 className="text-xs font-black text-white uppercase tracking-widest">Primary Brand Theme Accent</h4>
                  <p className="text-[11px] text-slate-400">Choose a distinct luxury tone. This instantly overrides buttons, badges, lines, and borders globally.</p>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {COLOR_PALETTE.map((color) => {
                    const active = activeAccentColor === color.id;
                    return (
                      <button
                        key={color.id}
                        type="button"
                        onClick={() => {
                          setActiveAccentColor(color.id);
                          addToast(`Brand accent updated to: ${color.name}`, 'success');
                        }}
                        className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                          active
                            ? 'bg-white/10 border-white/40 shadow-lg scale-[1.03]'
                            : 'bg-slate-950 border-white/5 hover:bg-slate-900'
                        }`}
                      >
                        <span className={`w-5 h-5 rounded-full ${color.bg} border border-white/25`} />
                        <span className="text-[9px] text-slate-300 font-bold tracking-tight text-center truncate w-full">{color.name}</span>
                      </button>
                    );
                  })}
                </div>
              </Card>

              {/* Dynamic Text Information */}
              <Card variant="standard" className="p-5 space-y-4 bg-slate-900/60">
                <h4 className="text-xs font-black text-white uppercase tracking-widest">Restaurant Identity Branding</h4>
                <div className="space-y-3">
                  <Input
                    label="Restaurant Name"
                    value={restaurantInfo.name}
                    onChange={(e) => setRestaurantInfo(prev => ({ ...prev, name: e.target.value }))}
                  />

                  <Input
                    label="Physical Address"
                    value={restaurantInfo.address}
                    onChange={(e) => setRestaurantInfo(prev => ({ ...prev, address: e.target.value }))}
                  />
                </div>

                <Button
                  size="sm"
                  variant="amber"
                  onClick={() => addToast('Restaurant identity saved!', 'success')}
                >
                  Save Branding Specs
                </Button>
              </Card>

            </div>
          </div>
        )}

        {/* -------------------------------------------
            13.5. MODULE: ORDER SIMULATOR TOOLS
           ------------------------------------------- */}
        {activeModule === 'simulator' && (
          <div className="space-y-6 text-left animate-in fade-in duration-300">
            <span className="text-xs text-slate-400 block mb-1">
              Saas Elite Sandbox Control. Simulate customer checkouts, dispatch high-status private couriers, and automate order tracking states in real-time.
            </span>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Customer Checkout Spawner (4 cols) */}
              <div className="lg:col-span-4 space-y-6">
                <Card variant="standard" className="p-5 space-y-4 bg-slate-900/60 border border-white/10">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                      <ShoppingBag className="w-4 h-4" />
                      <h4 className="text-xs uppercase font-black tracking-widest">Gourmet Checkout Spawner</h4>
                    </div>
                    <p className="text-[11px] text-slate-400">Instantly place simulated client orders. This populates your Merchant Queue and tests real-time tracking.</p>
                  </div>

                  <div className="space-y-2.5">
                    <button
                      type="button"
                      onClick={() => handleSimulateCheckout('brunch')}
                      className="w-full text-left p-3 rounded-2xl bg-slate-950 hover:bg-slate-900 border border-white/5 hover:border-amber-500/20 transition-all flex justify-between items-center group cursor-pointer"
                    >
                      <div className="space-y-0.5">
                        <span className="text-xs font-black text-white group-hover:text-amber-400 transition-colors">🥐 Parisian High Tea Brunch</span>
                        <p className="text-[10px] text-slate-400">Croissants, Pain au Chocolat, Café au Lait</p>
                      </div>
                      <span className="font-mono text-xs font-bold text-amber-400">$42.00</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSimulateCheckout('wagyu')}
                      className="w-full text-left p-3 rounded-2xl bg-slate-950 hover:bg-slate-900 border border-white/5 hover:border-indigo-500/20 transition-all flex justify-between items-center group cursor-pointer"
                    >
                      <div className="space-y-0.5">
                        <span className="text-xs font-black text-white group-hover:text-indigo-400 transition-colors">🥩 Chef’s Wagyu Ribeye Dinner</span>
                        <p className="text-[10px] text-slate-400">Truffle Ribeye Filet & Poached Lobster Tail</p>
                      </div>
                      <span className="font-mono text-xs font-bold text-indigo-400">$223.00</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSimulateCheckout('caviar')}
                      className="w-full text-left p-3 rounded-2xl bg-slate-950 hover:bg-slate-900 border border-white/5 hover:border-rose-500/20 transition-all flex justify-between items-center group cursor-pointer"
                    >
                      <div className="space-y-0.5">
                        <span className="text-xs font-black text-white group-hover:text-rose-400 transition-colors">🥂 Imperial Caviar & Champagne</span>
                        <p className="text-[10px] text-slate-400">Heritage Beluga Caviar & Dom Pérignon Vintage</p>
                      </div>
                      <span className="font-mono text-xs font-bold text-rose-400">$430.00</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSimulateCheckout('random')}
                      className="w-full text-left p-3 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 transition-all flex justify-between items-center group cursor-pointer"
                    >
                      <div className="space-y-0.5">
                        <span className="text-xs font-black text-amber-400">🎲 Random Gastronomic Selection</span>
                        <p className="text-[10px] text-amber-500/70">Picks 1-4 random specialties from active menu</p>
                      </div>
                      <span className="font-mono text-xs font-bold text-amber-400">Dynamic</span>
                    </button>
                  </div>
                </Card>

                {/* Courier Settings Panel */}
                <Card variant="standard" className="p-5 space-y-4 bg-slate-900/60 border border-white/10">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-indigo-400 font-bold">
                      <Truck className="w-4 h-4" />
                      <h4 className="text-xs uppercase font-black tracking-widest">Active Dispatch Driver</h4>
                    </div>
                    <p className="text-[11px] text-slate-400">Choose and customize the luxury courier dispatched on transit steps.</p>
                  </div>

                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { name: 'Jean-Luc Moreau', desc: 'Climate Sedan', phone: '+1 (212) 555-0199', notes: 'Vanguard Concierge, luxury sedan.' },
                        { name: 'Amélie Laurent', desc: 'Secure Valise', phone: '+1 (555) 302-8842', notes: 'Diplomatic Vault, armored transit.' },
                        { name: 'Pierre Dubois', desc: 'Carbon Velo', phone: '+1 (555) 728-1104', notes: 'Velo Premium, carbon insulated carrier.' }
                      ].map((courier, idx) => {
                        const active = simCourierName === courier.name;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setSimCourierName(courier.name);
                              setSimCourierPhone(courier.phone);
                              setSimCourierNotes(courier.notes);
                              addSimLog(`👤 Active driver assigned: ${courier.name} (${courier.desc})`);
                              addToast(`Driver preset selected: ${courier.name}`, 'info');
                            }}
                            className={`p-2 rounded-xl text-[10px] border font-bold flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                              active
                                ? 'bg-indigo-600/20 border-indigo-400 text-white shadow-sm'
                                : 'bg-slate-950 border-white/5 text-slate-400 hover:text-white hover:bg-slate-900'
                            }`}
                          >
                            <span className="font-black tracking-tight truncate w-full">{courier.name.split(' ')[0]}</span>
                            <span className="text-[8px] text-slate-500 font-normal truncate w-full">{courier.desc}</span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="space-y-2 border-t border-white/5 pt-3">
                      <Input
                        label="Courier Name"
                        value={simCourierName}
                        onChange={(e) => setSimCourierName(e.target.value)}
                        placeholder="Driver full name..."
                      />
                      <Input
                        label="Transit Instructions / Description"
                        value={simCourierNotes}
                        onChange={(e) => setSimCourierNotes(e.target.value)}
                        placeholder="Luxury climate-controlled security container..."
                      />
                    </div>
                  </div>
                </Card>
              </div>

              {/* Middle Column: Dispatch Control & Manual Progress (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                <Card variant="standard" className="p-5 space-y-4 bg-slate-900/60 border border-white/10">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                      <Sliders className="w-4 h-4" />
                      <h4 className="text-xs uppercase font-black tracking-widest">State Dispatch Board</h4>
                    </div>
                    <p className="text-[11px] text-slate-400">Target a specific active checkout and manually override or push tracking steps.</p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1.5">Target Simulation Order</label>
                      {orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length === 0 ? (
                        <div className="p-3 text-center rounded-xl bg-slate-950 border border-dashed border-white/10 text-slate-400 text-[11px]">
                          ⚠️ No active simulation orders. Place a gourmet order above!
                        </div>
                      ) : (
                        <select
                          value={selectedSimOrderId}
                          onChange={(e) => {
                            setSelectedSimOrderId(e.target.value);
                            addSimLog(`🎯 Selected Order #${e.target.value.split('-').pop()} for tracking simulation.`);
                          }}
                          className="w-full p-2.5 rounded-xl bg-slate-950 text-white border border-white/10 text-xs font-bold font-mono focus:border-amber-400 outline-none"
                        >
                          <option value="">-- Choose Active Order --</option>
                          {orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').map(order => (
                            <option key={order.id} value={order.id}>
                              {order.id.split('-').pop()} - {order.customerName} (${order.total.toFixed(2)}) [{order.status}]
                            </option>
                          ))}
                        </select>
                      )}
                    </div>

                    {selectedSimOrderId && (() => {
                      const activeOrder = orders.find(o => o.id === selectedSimOrderId);
                      if (!activeOrder) return null;

                      const statusColors: { [key: string]: string } = {
                        pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
                        confirmed: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
                        preparing: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
                        cooking: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
                        ready: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
                        out_for_delivery: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
                        dispatched: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
                        delivered: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
                        cancelled: 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      };

                      return (
                        <div className="space-y-4 border-t border-white/5 pt-4">
                          <div className="bg-slate-950 p-3 rounded-2xl border border-white/5 text-[11px] space-y-1.5">
                            <div className="flex justify-between items-center">
                              <span className="text-slate-400">Order ID:</span>
                              <strong className="text-white font-mono">{activeOrder.id}</strong>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-400">Customer:</span>
                              <strong className="text-white font-sans">{activeOrder.customerName}</strong>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-400">Current Status:</span>
                              <span className={`px-1.5 py-0.5 rounded text-[9px] uppercase font-bold border ${statusColors[activeOrder.status] || 'bg-white/5'}`}>
                                {activeOrder.status}
                              </span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <span className="block text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1">Manual Transitions</span>
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                type="button"
                                onClick={() => handleManualAdvance('confirmed')}
                                className="p-2 text-center rounded-xl bg-slate-950 hover:bg-slate-900 border border-white/10 hover:border-sky-500/30 text-[10px] font-bold text-sky-400 cursor-pointer"
                              >
                                🤝 Confirm Order
                              </button>
                              <button
                                type="button"
                                onClick={() => handleManualAdvance('preparing')}
                                className="p-2 text-center rounded-xl bg-slate-950 hover:bg-slate-900 border border-white/10 hover:border-yellow-500/30 text-[10px] font-bold text-yellow-400 cursor-pointer"
                              >
                                🍳 Start Cooking
                              </button>
                              <button
                                type="button"
                                onClick={() => handleManualAdvance('ready')}
                                className="p-2 text-center rounded-xl bg-slate-950 hover:bg-slate-900 border border-white/10 hover:border-purple-500/30 text-[10px] font-bold text-purple-400 cursor-pointer"
                              >
                                🛎️ Plated & Ready
                              </button>
                              <button
                                type="button"
                                onClick={() => handleManualAdvance('out_for_delivery')}
                                className="p-2 text-center rounded-xl bg-slate-950 hover:bg-slate-900 border border-white/10 hover:border-indigo-500/30 text-[10px] font-bold text-indigo-400 cursor-pointer"
                              >
                                🏎️ Dispatch Courier
                              </button>
                              <button
                                type="button"
                                onClick={() => handleManualAdvance('delivered')}
                                className="p-2 text-center rounded-xl bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/20 text-[10px] font-bold text-emerald-400 cursor-pointer"
                              >
                                ✅ Arrived & Delivered
                              </button>
                              <button
                                type="button"
                                onClick={() => handleManualAdvance('cancelled')}
                                className="p-2 text-center rounded-xl bg-rose-950 hover:bg-rose-900 border border-rose-500/20 text-[10px] font-bold text-rose-400 cursor-pointer"
                              >
                                🚫 Cancel Order
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </Card>
              </div>

              {/* Right Column: Auto-Pilot & Logs Terminal (5 cols) */}
              <div className="lg:col-span-8 space-y-6">
                <Card variant="standard" className="p-5 bg-slate-900/60 border border-white/10 flex flex-col h-full justify-between">
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-orange-400 font-bold">
                          <Clock className="w-4 h-4" />
                          <h4 className="text-xs uppercase font-black tracking-widest">Auto-Pilot Progress Engine</h4>
                        </div>
                        <p className="text-[11px] text-slate-400">Let the simulator automatically progress order states. Perfect for testing full-lifecycle tracking flow.</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (!selectedSimOrderId) {
                            addToast('Please select a target simulation order first!', 'warning');
                            return;
                          }
                          setAutoPilotActive(!autoPilotActive);
                          addSimLog(`⚠️ Auto-Pilot state shifted: ${!autoPilotActive ? 'ON' : 'OFF'}`);
                        }}
                        disabled={!selectedSimOrderId}
                        className={`px-4 py-2 rounded-xl text-xs font-black tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                          !selectedSimOrderId ? 'bg-slate-800 text-slate-600 border border-white/5 cursor-not-allowed' :
                          autoPilotActive
                            ? 'bg-rose-600 text-white shadow-lg animate-pulse'
                            : 'bg-emerald-500 text-slate-950 font-black shadow-md hover:scale-[1.03]'
                        }`}
                      >
                        {autoPilotActive ? '⏹️ Stop Auto-Pilot' : '▶️ Run Auto-Pilot'}
                      </button>
                    </div>

                    <div className="flex items-center gap-4 border-t border-white/5 pt-3">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 whitespace-nowrap">Auto-Pilot Speed:</span>
                      <div className="flex gap-1.5 flex-1">
                        {[4, 8, 15, 30].map((speedValue) => (
                          <button
                            key={speedValue}
                            type="button"
                            onClick={() => {
                              setAutoPilotSpeed(speedValue);
                              addSimLog(`⚙️ Speed changed: ${speedValue} seconds per state step.`);
                            }}
                            className={`flex-1 py-1 px-2.5 rounded-lg text-[10px] font-mono font-black border transition-all cursor-pointer ${
                              autoPilotSpeed === speedValue
                                ? 'bg-amber-500 text-slate-950 border-amber-400 font-black'
                                : 'bg-slate-950 border-white/5 text-slate-400 hover:text-white'
                            }`}
                          >
                            {speedValue}s
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Retro Terminal Logs block */}
                  <div className="space-y-2 mt-4 flex-1 flex flex-col">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Simulation Logs</span>
                      <button
                        type="button"
                        onClick={() => setSimLogs(['[' + new Date().toLocaleTimeString() + '] 🔵 Terminal buffer cleared.'])}
                        className="text-[9px] uppercase tracking-wider text-amber-500 hover:underline cursor-pointer"
                      >
                        Clear Terminal
                      </button>
                    </div>

                    <div className="bg-slate-950 border border-white/10 rounded-2xl p-4 h-56 font-mono text-[10px] leading-relaxed text-emerald-400 overflow-y-auto text-left space-y-1 scrollbar-thin select-all">
                      {simLogs.map((log, index) => (
                        <div key={index} className="whitespace-pre-wrap select-all">
                          {log}
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>

            </div>
          </div>
        )}

        {/* -------------------------------------------
            14. MODULE: DESIGN SYSTEM PLAYGROUND
           ------------------------------------------- */}
        {activeModule === 'design-showroom' && (
          <div className="space-y-8 text-left">
            <span className="text-xs text-slate-400 block mb-2">
              Comprehensive showroom displaying all custom, pixel-perfect atomic UI components built according to our premium design specifications.
            </span>

            {/* Typography scale */}
            <div className="space-y-3">
              <h4 className="text-xs font-black text-amber-400 uppercase tracking-widest border-b border-white/15 pb-2">1. Typography Scales</h4>
              <div className="space-y-3 bg-white/5 p-5 rounded-3xl border border-white/5">
                <div>
                  <span className="text-[9px] font-mono text-slate-500 font-bold block mb-1">Display Title 2XL (Space Grotesk - 36px)</span>
                  <h1 className="font-display font-black text-white text-3xl md:text-4xl">L’Étoile Gastronomique</h1>
                </div>
                <div>
                  <span className="text-[9px] font-mono text-slate-500 font-bold block mb-1">Display Title LG (Space Grotesk - 24px)</span>
                  <h2 className="font-display font-bold text-white text-xl md:text-2xl">Signature Culinary Selection</h2>
                </div>
                <div>
                  <span className="text-[9px] font-mono text-slate-500 font-bold block mb-1">Body Text Large (Inter - 16px)</span>
                  <p className="font-sans text-base text-slate-300">Experience world-class French-American culinary fusion.</p>
                </div>
                <div>
                  <span className="text-[9px] font-mono text-slate-500 font-bold block mb-1">System Technical Code (JetBrains Mono - 12px)</span>
                  <p className="font-mono text-xs text-amber-400 font-bold">#LES-ORDER-9382104-DECRYPTED</p>
                </div>
              </div>
            </div>

            {/* Button Variations */}
            <div className="space-y-3">
              <h4 className="text-xs font-black text-amber-400 uppercase tracking-widest border-b border-white/15 pb-2">2. Button Variations & Handlers</h4>
              <div className="bg-white/5 p-5 rounded-3xl border border-white/5 flex flex-wrap gap-3">
                <Button variant="solid">Solid White</Button>
                <Button variant="outline">Outline Glass</Button>
                <Button variant="soft">Soft Obsidian</Button>
                <Button variant="amber">Amber Accent</Button>
                <Button variant="danger">Danger Red</Button>
                <Button variant="solid" loading>Loading Chime</Button>
              </div>
            </div>

            {/* Form controls */}
            <div className="space-y-3">
              <h4 className="text-xs font-black text-amber-400 uppercase tracking-widest border-b border-white/15 pb-2">3. Responsive Form Inputs</h4>
              <div className="bg-white/5 p-5 rounded-3xl border border-white/5 grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input label="Normal Input Text" placeholder="Write text content..." />
                <Input label="Error Validation" error="Min length of criteria not met" placeholder="Invalid write..." />
                <div className="space-y-3 flex flex-col justify-end">
                  <Checkbox label="Acknowledge Premium Terms" defaultChecked />
                  <Radio label="Instant Courier Delivery" defaultChecked />
                </div>
              </div>
            </div>

            {/* Badges and Tags */}
            <div className="space-y-3">
              <h4 className="text-xs font-black text-amber-400 uppercase tracking-widest border-b border-white/15 pb-2">4. Badges, Tags, and Avatars</h4>
              <div className="bg-white/5 p-5 rounded-3xl border border-white/5 flex flex-wrap gap-4 items-center">
                <Badge variant="primary">Primary Badge</Badge>
                <Badge variant="success">Success Status</Badge>
                <Badge variant="error">Critical Fail</Badge>
                <Tag>Truffle Infused</Tag>
                <Tag>Wagyu Reserve</Tag>
                <Avatar name="Pierre Marceau" />
                <Avatar name="Lord Winston" />
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};
