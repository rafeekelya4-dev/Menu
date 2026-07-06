import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, Plus, Minus, CreditCard, Sparkles, MapPin, CheckCircle, Tag, AlertCircle, ShoppingBag, Receipt, Timer } from 'lucide-react';
import { CartItem, Product, RestaurantInfo } from '../types';
import { EmptyState } from './EmptyState';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, newQuantity: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  restaurantInfo: RestaurantInfo;
  appliedCode: string | null;
  onApplyCode: (code: string | null) => void;
  onPlaceOrder?: (
    items: CartItem[],
    subtotal: number,
    discount: number,
    deliveryFee: number,
    tipAmount: number,
    total: number
  ) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  restaurantInfo,
  appliedCode,
  onApplyCode,
  onPlaceOrder
}) => {
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState<string | null>(null);
  const [promoSuccess, setPromoSuccess] = useState<string | null>(null);
  const [checkoutStage, setCheckoutStage] = useState<'cart' | 'processing' | 'success'>('cart');
  const [checkoutStepMsg, setCheckoutStepMsg] = useState('');
  const [selectedTip, setSelectedTip] = useState<number>(18); // default 18% tip

  if (!isOpen) return null;

  // Calculate Subtotal
  const subtotal = cartItems.reduce((acc, item) => {
    const addonsPrice = item.selectedAddons ? item.selectedAddons.reduce((sum, add) => sum + add.price, 0) : 0;
    return acc + (item.product.price + addonsPrice) * item.quantity;
  }, 0);

  // Calculate discounts
  let discountAmount = 0;
  let deliveryFee = restaurantInfo.deliveryFee;

  if (appliedCode === 'GRANDE20') {
    // 20% off signature mains
    const signatureMainsSubtotal = cartItems
      .filter((item) => item.product.category === 'Signature Mains')
      .reduce((acc, item) => {
        const addonsPrice = item.selectedAddons ? item.selectedAddons.reduce((sum, add) => sum + add.price, 0) : 0;
        return acc + (item.product.price + addonsPrice) * item.quantity;
      }, 0);
    discountAmount = signatureMainsSubtotal * 0.2;
  } else if (appliedCode === 'FREESHIP' && subtotal >= 40) {
    deliveryFee = 0;
  } else if (appliedCode === 'PISTACHIO') {
    // Buy 1 Get 1 free (Sicilian Pistachio Croissant - prod-5)
    const pistachioItem = cartItems.find((item) => item.product.id === 'prod-5');
    if (pistachioItem && pistachioItem.quantity >= 2) {
      // Refund cost of half of the croissants (or 1 if odd, etc.)
      const freeCount = Math.floor(pistachioItem.quantity / 2);
      const addonsPrice = pistachioItem.selectedAddons ? pistachioItem.selectedAddons.reduce((sum, add) => sum + add.price, 0) : 0;
      discountAmount = freeCount * (pistachioItem.product.price + addonsPrice);
    }
  }

  const tipAmount = subtotal * (selectedTip / 100);
  const finalTotal = Math.max(0, subtotal - discountAmount + deliveryFee + tipAmount);
  const underMinimum = subtotal > 0 && subtotal < restaurantInfo.minOrder;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoInput.trim().toUpperCase();
    if (!code) return;

    if (code === 'GRANDE20') {
      onApplyCode(code);
      setPromoSuccess('Promo GRANDE20 Applied: 20% off all Signature Mains!');
      setPromoError(null);
    } else if (code === 'FREESHIP') {
      if (subtotal < 40) {
        setPromoError('FREESHIP requires a subtotal of at least $40.00');
        setPromoSuccess(null);
      } else {
        onApplyCode(code);
        setPromoSuccess('Promo FREESHIP Applied: Free White-Glove Delivery!');
        setPromoError(null);
      }
    } else if (code === 'PISTACHIO') {
      const hasPistachio = cartItems.some((item) => item.product.id === 'prod-5');
      if (!hasPistachio) {
        setPromoError('PISTACHIO promo requires Sicilian Pistachio Croissant in cart');
        setPromoSuccess(null);
      } else {
        onApplyCode(code);
        setPromoSuccess('Promo PISTACHIO Applied: Buy 1 Get 1 Croissant!');
        setPromoError(null);
      }
    } else {
      setPromoError('Invalid promo code. Try GRANDE20, FREESHIP or PISTACHIO.');
      setPromoSuccess(null);
    }
  };

  const handleCheckout = async () => {
    if (underMinimum) return;
    setCheckoutStage('processing');
    
    setCheckoutStepMsg('Verifying gourmet items allocation...');
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setCheckoutStepMsg('Contacting secure credit-card gateway...');
    await new Promise((resolve) => setTimeout(resolve, 1200));

    setCheckoutStepMsg('Confirming table reservation & delivery courier dispatch...');
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (onPlaceOrder) {
      onPlaceOrder(cartItems, subtotal, discountAmount, deliveryFee, tipAmount, finalTotal);
    }
    setCheckoutStage('success');
  };

  const resetCheckout = () => {
    onClearCart();
    onApplyCode(null);
    setPromoInput('');
    setPromoSuccess(null);
    setPromoError(null);
    setCheckoutStage('cart');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
      />

      {/* Main Drawer Container */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="relative bg-white w-full max-w-md h-full shadow-[0_0_50px_rgba(0,0,0,0.15)] flex flex-col z-10 border-l border-slate-200 text-slate-800"
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/55">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-orange-600 animate-pulse" />
            <h2 className="font-display font-black text-slate-900 text-lg">
              Your Culinary Basket
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center border border-slate-200/40"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic content stage */}
        <div className="flex-1 overflow-y-auto">
          {checkoutStage === 'cart' && (
            <>
              {cartItems.length === 0 ? (
                <div className="py-16 px-4">
                  <EmptyState
                    type="cart"
                    actionText="Browse Menu"
                    onAction={onClose}
                  />
                </div>
              ) : (
                <div className="p-5 space-y-4">
                  {/* Cart Items List */}
                  <div className="divide-y divide-slate-100 space-y-3">
                    {cartItems.map((item) => {
                      const addonsPrice = item.selectedAddons ? item.selectedAddons.reduce((sum, add) => sum + add.price, 0) : 0;
                      const itemTotalPrice = (item.product.price + addonsPrice) * item.quantity;
                      const itemId = item.id || item.product.id;

                      return (
                        <div key={itemId} className="pt-3 first:pt-0 flex gap-4">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-16 h-16 rounded-xl object-cover border border-slate-200/80 bg-slate-50"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-slate-900 text-sm truncate">
                              {item.product.name}
                            </h4>
                            <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider block">
                              {item.product.category}
                            </span>

                            {/* Render Selected Add-ons */}
                            {item.selectedAddons && item.selectedAddons.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {item.selectedAddons.map((add) => (
                                  <span key={add.id} className="text-[9px] bg-orange-50 border border-orange-100 text-orange-700 px-1.5 py-0.5 rounded-md font-bold">
                                    + {add.name} (+${add.price.toFixed(2)})
                                  </span>
                                ))}
                              </div>
                            )}
                            
                            {/* Instructions Notes preview */}
                            {item.notes && (
                              <p className="text-[11px] font-mono italic text-orange-600 mt-1 truncate bg-orange-50/50 px-2 py-0.5 rounded border border-orange-100/40">
                                Note: "{item.notes}"
                              </p>
                            )}

                            <div className="flex items-center justify-between mt-2.5">
                              <span className="font-bold text-slate-900 text-sm font-mono">
                                ${itemTotalPrice.toFixed(2)}
                              </span>

                              {/* Quantity buttons */}
                              <div className="flex items-center border border-slate-200 rounded-full py-1 px-2.5 bg-slate-50 scale-90 origin-right">
                                <button
                                  onClick={() => onUpdateQuantity(itemId, item.quantity - 1)}
                                  className="text-slate-500 hover:text-slate-800 cursor-pointer min-h-[24px] min-w-[24px] flex items-center justify-center"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="w-6 text-center text-xs font-bold font-mono text-slate-800">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => onUpdateQuantity(itemId, item.quantity + 1)}
                                  className="text-slate-500 hover:text-slate-800 cursor-pointer min-h-[24px] min-w-[24px] flex items-center justify-center"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Remove item trigger */}
                          <button
                            onClick={() => onRemoveItem(itemId)}
                            className="text-slate-400 hover:text-rose-500 p-1 cursor-pointer self-start transition-colors"
                            title="Remove item"
                          >
                            <Trash2 className="w-4.5 h-4.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {/* Promo Input Section */}
                  <div className="border-t border-slate-100 pt-5 mt-6">
                    <form onSubmit={handleApplyPromo} className="space-y-2">
                      <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
                        Apply Gourmet Promo Code
                      </label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                          <input
                            type="text"
                            placeholder="GRANDE20, FREESHIP, PISTACHIO"
                            value={promoInput}
                            onChange={(e) => setPromoInput(e.target.value)}
                            className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-200 focus:border-orange-500 focus:outline-hidden rounded-xl bg-white uppercase font-mono tracking-wider text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500/10"
                          />
                        </div>
                        <button
                          type="submit"
                          className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-black cursor-pointer transition-all border border-orange-500 shadow-sm"
                        >
                          Apply
                        </button>
                      </div>
                      
                      {promoError && (
                        <p className="text-[11px] text-rose-600 flex items-center gap-1 font-semibold bg-rose-50 p-2 rounded-lg border border-rose-100">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          {promoError}
                        </p>
                      )}
                      
                      {promoSuccess && (
                        <p className="text-[11px] text-emerald-700 flex items-center gap-1 font-semibold bg-emerald-50 p-2 rounded-lg border border-emerald-100">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          {promoSuccess}
                        </p>
                      )}
                    </form>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Checkout Stage: Processing Handshake */}
          {checkoutStage === 'processing' && (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-slate-50/40">
              <div className="relative mb-6">
                <div className="w-16 h-16 border-4 border-slate-100 border-t-orange-600 rounded-full animate-spin" />
                <ShoppingBag className="w-6 h-6 text-orange-600 absolute inset-0 m-auto animate-pulse" />
              </div>
              <h3 className="font-display font-black text-slate-900 text-lg mb-2">
                Processing Secure Order
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed max-w-xs font-mono">
                {checkoutStepMsg}
              </p>
            </div>
          )}

          {/* Checkout Stage: Completed Success Receipt Map */}
          {checkoutStage === 'success' && (
            <div className="p-5 space-y-5 overflow-y-auto max-h-[85vh] bg-slate-50/20">
              {/* Animated Ring Pulse confirmation */}
              <div className="text-center">
                <div className="relative inline-flex items-center justify-center p-3 bg-emerald-50 rounded-full mb-3.5 border border-emerald-200">
                  <div className="absolute inset-0 rounded-full border border-emerald-500/30 animate-ping" />
                  <CheckCircle className="w-9 h-9 text-emerald-600 relative z-10" />
                </div>
                <h3 className="font-display font-black text-slate-900 text-lg tracking-tight">
                  Michelin Order Confirmed
                </h3>
                <p className="text-slate-500 text-xs mt-0.5 font-bold">
                  Private dispatch code: <span className="font-mono text-orange-600 font-black">#ETOILE-{Math.floor(100000 + Math.random() * 900000)}</span>
                </p>
              </div>

              {/* Arrival Countdown & Delivery Estimate */}
              <div className="bg-orange-50/80 border border-orange-100 rounded-2xl p-4 text-center">
                <span className="text-[10px] uppercase font-black tracking-widest text-orange-700 block mb-0.5">Estimated Arrival Time</span>
                <h4 className="text-2.5xl font-display font-black text-orange-600 my-1 font-mono">
                  25 - 35 mins
                </h4>
                <p className="text-[11px] text-slate-600">
                  Target Handover: <strong className="text-slate-800 font-mono">{new Date(Date.now() + 30 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong>
                </p>
              </div>

              {/* Vintage Thermal Restaurant Receipt Paper */}
              <div className="bg-white text-slate-900 rounded-3xl p-5.5 shadow-[0_15px_40px_rgba(0,0,0,0.06)] font-mono text-xs border border-slate-200 relative overflow-hidden">
                {/* Vintage top cut dots */}
                <div className="absolute top-0 left-0 right-0 flex justify-between gap-1 px-1">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <span key={i} className="text-[9px] text-slate-300 select-none">-</span>
                  ))}
                </div>

                {/* Header info */}
                <div className="text-center space-y-1 pb-3 border-b border-dashed border-slate-300 pt-2">
                  <h4 className="font-black text-slate-900 tracking-wider text-sm">L’ÉTOILE GASTRONOMIQUE</h4>
                  <p className="text-[10px] text-slate-500">450 Park Avenue, Upper Manhattan</p>
                  <p className="text-[9px] text-slate-400">{new Date().toLocaleString()}</p>
                </div>

                {/* Itemized Delivery Summary & Prep Notes */}
                <div className="py-3.5 space-y-3 border-b border-dashed border-slate-300">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Itemized Summary</span>
                  {cartItems.map((item) => (
                    <div key={item.product.id} className="space-y-1">
                      <div className="flex justify-between font-bold text-slate-800">
                        <span>{item.quantity}x {item.product.name}</span>
                        <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                      </div>
                      {item.notes && (
                        <p className="text-[10px] text-orange-700 bg-orange-50 p-1.5 rounded-md leading-relaxed border border-orange-100 italic">
                          ↳ Request: "{item.notes}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Financial breakdown */}
                <div className="py-3 space-y-1.5 text-slate-650">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-rose-600 font-bold">
                      <span>Promo Discount</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Courier Transport</span>
                    <span>{deliveryFee === 0 ? 'COMPLIMENTARY' : `$${deliveryFee.toFixed(2)}`}</span>
                  </div>
                  {tipAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Courier Gratuity ({selectedTip}%)</span>
                      <span>${tipAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-900 font-black text-sm pt-2 border-t border-slate-200">
                    <span>TOTAL PAID</span>
                    <span className="text-orange-600">${finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Barcode Mockup */}
                <div className="pt-4 text-center space-y-1 pb-1">
                  <div className="text-lg leading-none tracking-widest font-mono text-slate-600">
                    ||||| | |||| ||| || ||| | |||
                  </div>
                  <span className="text-[9px] text-slate-400 uppercase tracking-widest">Thank you for dining with L’Étoile</span>
                </div>
              </div>

              {/* Delivery Destination Badge */}
              <div className="text-[11px] font-medium text-center text-slate-600 flex items-center gap-1.5 justify-center bg-slate-100 p-3.5 rounded-2xl border border-slate-200/60">
                <MapPin className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                <span className="truncate font-medium">Destination: {restaurantInfo.address}</span>
              </div>

              <button
                onClick={resetCheckout}
                className="w-full py-3.5 bg-orange-600 hover:bg-orange-700 text-white rounded-full text-xs font-black cursor-pointer transition-all border border-orange-500 shadow-md uppercase tracking-wider"
              >
                Return to Culinary Menu
              </button>
            </div>
          )}
        </div>

        {/* Drawer Sticky calculations & Checkout button */}
        {checkoutStage === 'cart' && cartItems.length > 0 && (
          <div className="border-t border-slate-100 p-5 bg-white shadow-[0_-10px_30px_rgba(0,0,0,0.02)]">
            {/* Minimum Order constraint notice */}
            {underMinimum && (
              <div className="mb-4 bg-orange-50 text-orange-700 p-3 rounded-2xl border border-orange-100 flex items-start gap-2 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-orange-600" />
                <div>
                  <span className="font-bold">Minimum order is ${restaurantInfo.minOrder.toFixed(2)}</span>.
                  <p className="text-slate-600 text-[11px] mt-0.5">Please add another ${(restaurantInfo.minOrder - subtotal).toFixed(2)} to request kitchen dispatch.</p>
                </div>
              </div>
            )}

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Basket Subtotal</span>
                <span className="font-mono font-bold text-slate-800">${subtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-rose-600 font-bold">
                  <span>Applied Discount</span>
                  <span className="font-mono">-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Premium Delivery Fee</span>
                <span className="font-mono font-bold text-slate-800">
                  {deliveryFee === 0 ? 'Complimentary' : `$${deliveryFee.toFixed(2)}`}
                </span>
              </div>

              {/* Tip Selection Row */}
              <div className="border-y border-slate-100 py-2.5 my-1 bg-slate-50 p-3 rounded-2xl border border-slate-200/40">
                <span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 text-left">
                  White-Glove Courier Gratuity
                </span>
                <div className="grid grid-cols-5 gap-1.5">
                  {[0, 15, 18, 20, 25].map((tip) => (
                    <button
                      key={tip}
                      type="button"
                      onClick={() => setSelectedTip(tip)}
                      className={`py-1.5 px-1 rounded-lg text-[11px] font-mono font-bold transition-all border text-center cursor-pointer ${
                        selectedTip === tip
                          ? 'bg-orange-600 text-white border-orange-500 shadow-xs'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {tip === 0 ? 'Cash' : `${tip}%`}
                    </button>
                  ))}
                </div>
              </div>

              {tipAmount > 0 && (
                <div className="flex justify-between text-slate-600 text-xs font-medium">
                  <span>Courier Gratuity ({selectedTip}%)</span>
                  <span className="font-mono font-bold text-slate-800">${tipAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-900 font-black text-base pt-2 border-t border-slate-100">
                <span>Estimated Total</span>
                <span className="font-mono text-orange-600 text-lg">${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Sticky Native Touch Target action button */}
            <button
              onClick={handleCheckout}
              disabled={underMinimum}
              className={`w-full py-3.5 px-6 rounded-full text-sm font-black transition-all cursor-pointer min-h-[44px] flex items-center justify-center gap-2 border mt-4 ${
                underMinimum
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed border-slate-200'
                  : 'bg-orange-600 hover:bg-orange-700 text-white border-orange-500 hover:shadow-lg active:scale-[0.98]'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              Secure Checkout • ${finalTotal.toFixed(2)}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
