import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, Star, Clock, Plus, Minus, MessageSquare, Flame, Utensils, Check, ArrowRight } from 'lucide-react';
import { Product, Review } from '../types';
import { INITIAL_REVIEWS } from '../data';

interface ProductDetailModalProps {
  product: Product;
  allProducts: Product[];
  favorites: string[];
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onAddToCart: (product: Product, quantity: number, notes: string, addons?: { id: string; name: string; price: number; }[]) => void;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
  addons?: { id: string; name: string; price: number; desc?: string; }[];
}

export const ADDONS_LIST = [
  { id: 'add-1', name: 'Extra Shaved Black Truffle', price: 8.00, desc: 'Add 3g fresh Umbrian black truffle flakes' },
  { id: 'add-2', name: 'Edible Gold Leaf Garnish', price: 15.00, desc: 'Coat the master dish with 24K edible gold foliage' },
  { id: 'add-3', name: 'Saffron Velvet Infused Sauce', price: 5.50, desc: 'Drizzle with rare Kashmiri saffron reduction' },
  { id: 'add-4', name: '10g Imperial Ossetra Caviar Spoon', price: 35.00, desc: 'Served on mother-of-pearl spoon' }
];

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  allProducts,
  favorites,
  onToggleFavorite,
  onClose,
  onSelectProduct,
  onAddToCart,
  addons = ADDONS_LIST
}) => {
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [selectedAddons, setSelectedAddons] = useState<{ id: string; name: string; price: number; }[]>([]);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);

  // Multi-image switcher & interactive zoom state
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [isZooming, setIsZooming] = useState(false);

  const imagesList = product.images && product.images.length > 0
    ? product.images
    : [product.image];

  // Scroll to top of modal when product changes
  useEffect(() => {
    setQuantity(1);
    setNotes('');
    setSelectedAddons([]);
    setImageLoaded(false);
    setActiveImageIdx(0);
    setIsZooming(false);
    // Focus the modal content top
    const modalContent = document.getElementById('modal-scroll-viewport');
    if (modalContent) {
      modalContent.scrollTop = 0;
    }
  }, [product]);

  const isFavorite = favorites.includes(product.id);

  // Recommendations: Similar meals in the same category, excluding itself
  const recommendations = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  // Fallback to other products if category has no matches
  const fallbackRecommendations = recommendations.length > 0 
    ? recommendations 
    : allProducts.filter((p) => p.id !== product.id).slice(0, 3);

  const handleHelpful = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) => {
        if (r.id === reviewId) {
          const userHasHelpful = !r.userHasHelpful;
          return {
            ...r,
            helpfulCount: userHasHelpful ? r.helpfulCount + 1 : r.helpfulCount - 1,
            userHasHelpful
          };
        }
        return r;
      })
    );
  };

  const handleAdd = () => {
    onAddToCart(product, quantity, notes, selectedAddons);
    setAddedFeedback(true);
    setTimeout(() => {
      setAddedFeedback(false);
      onClose();
    }, 1200);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 md:p-6 bg-slate-900/65 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.98 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="relative bg-white w-full max-w-2xl h-full sm:h-[88vh] sm:rounded-[2.25rem] border border-slate-200 shadow-[0_30px_70px_rgba(0,0,0,0.18)] flex flex-col overflow-hidden text-slate-800"
      >
        {/* Absolute Header Actions */}
        <div className="absolute top-4 left-4 right-4 z-20 flex justify-between pointer-events-none">
          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-md backdrop-blur-xs transition-all cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center pointer-events-auto active:scale-90 border border-slate-200/60"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5 text-slate-700" />
          </button>

          <button
            onClick={(e) => onToggleFavorite(product.id, e)}
            className="p-2.5 rounded-full bg-white/90 hover:bg-white text-slate-300 shadow-md backdrop-blur-xs transition-all cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center pointer-events-auto active:scale-90 border border-slate-200/60"
            aria-label="Favorite product"
          >
            <Heart
              className={`w-5 h-5 transition-colors ${
                isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-400'
              }`}
            />
          </button>
        </div>

        {/* Scrollable Body Viewport */}
        <div
          id="modal-scroll-viewport"
          className="flex-1 overflow-y-auto pb-24 scroll-smooth"
        >
          {/* Main Hero Image Slide Stage with Interactive Loupe Zoom */}
          <div className="relative aspect-16/9 sm:aspect-21/9 bg-slate-50 overflow-hidden border-b border-slate-200">
            {!imageLoaded && (
              <div className="absolute inset-0 bg-slate-100 shimmer" />
            )}
            <div
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsZooming(true)}
              onMouseLeave={() => setIsZooming(false)}
              className="w-full h-full cursor-zoom-in relative overflow-hidden"
            >
              <img
                src={imagesList[activeImageIdx]}
                alt={product.name}
                referrerPolicy="no-referrer"
                onLoad={() => setImageLoaded(true)}
                style={isZooming ? {
                  transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                  transform: 'scale(1.9)',
                  transition: 'transform 0.1s ease-out'
                } : {
                  transform: 'scale(1)',
                  transition: 'transform 0.3s ease-out'
                }}
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent pointer-events-none" />
            
            {/* Overlay Category Tag */}
            <div className="absolute bottom-4 left-4 flex gap-2">
              <span className="bg-orange-600 text-white text-xs font-black px-3 py-1 rounded-md shadow-xs uppercase tracking-wider">
                {product.category}
              </span>
              <span className="bg-white/95 border border-slate-200/80 text-slate-800 text-xs font-bold px-3 py-1 rounded-md shadow-xs backdrop-blur-xs flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-orange-600" />
                {product.prepTime} min
              </span>
            </div>

            {/* Micro Indicator if Zooming */}
            {isZooming && (
              <div className="absolute top-4 right-4 bg-white/95 border border-slate-200 px-2.5 py-1 rounded-md text-[9px] uppercase tracking-widest font-black text-orange-600 pointer-events-none shadow-xs">
                Interactive Zoom Active
              </div>
            )}
          </div>

          {/* Mini thumbnails slider row (if item has multiple images) */}
          {imagesList.length > 1 && (
            <div className="flex justify-center gap-2.5 px-6 py-3 bg-slate-50 border-b border-slate-100 overflow-x-auto">
              {imagesList.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveImageIdx(idx);
                    setImageLoaded(false);
                  }}
                  className={`w-16 h-11 rounded-lg overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                    activeImageIdx === idx ? 'border-orange-600 scale-105 shadow-xs' : 'border-slate-200 opacity-65 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Core Content */}
          <div className="p-6">
            <div className="flex items-start justify-between mb-2">
              <h1 className="font-display font-black text-slate-900 text-2xl tracking-tight leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Price Row */}
            <div className="flex items-center gap-3 mb-4">
              <span className="font-display font-black text-2xl text-slate-900">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-slate-400 line-through text-sm font-semibold">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                  <span className="bg-orange-50 text-orange-700 text-xs font-black px-2 py-0.5 rounded-sm border border-orange-100">
                    Save ${(product.originalPrice - product.price).toFixed(2)}
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-slate-600 text-sm leading-relaxed mb-6 font-light">
              {product.description}
            </p>

            {/* Advanced Quick Specs Bento Section */}
            <div className="grid grid-cols-4 gap-2 bg-slate-50 border border-slate-200/80 rounded-2xl p-3 mb-6 text-center text-xs">
              <div className="flex flex-col items-center justify-center p-1">
                <Flame className="w-4.5 h-4.5 text-orange-600 mb-1 animate-pulse" />
                <span className="text-[9px] uppercase font-bold tracking-wider text-slate-500">Calories</span>
                <span className="text-xs font-bold text-slate-800 font-mono mt-0.5">
                  {product.calories ? `${product.calories} kcal` : '~420 kcal'}
                </span>
              </div>
              <div className="flex flex-col items-center justify-center border-l border-slate-200 p-1">
                <Utensils className="w-4.5 h-4.5 text-emerald-600 mb-1" />
                <span className="text-[9px] uppercase font-bold tracking-wider text-slate-500">Protein</span>
                <span className="text-xs font-bold text-slate-800 font-mono mt-0.5">
                  {product.protein ?? 'Fresh / Order'}
                </span>
              </div>
              <div className="flex flex-col items-center justify-center border-l border-slate-200 p-1">
                <Star className="w-4.5 h-4.5 text-amber-500 mb-1 fill-amber-500/20" />
                <span className="text-[9px] uppercase font-bold tracking-wider text-slate-500">Rating</span>
                <span className="text-xs font-bold text-slate-800 font-mono mt-0.5">
                  {product.rating} ★
                </span>
              </div>
              <div className="flex flex-col items-center justify-center border-l border-slate-200 p-1">
                <span className="text-base mb-1">🌶️</span>
                <span className="text-[9px] uppercase font-bold tracking-wider text-slate-500">Heat Lvl</span>
                <span className="text-xs font-bold text-slate-800 mt-0.5">
                  {product.spiceLevel !== undefined && product.spiceLevel > 0 
                    ? `Level ${product.spiceLevel}` 
                    : 'Mild / None'}
                </span>
              </div>
            </div>

            {/* Premium Ingredients List */}
            {product.ingredients && product.ingredients.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-2.5">
                  Gourmet Ingredients
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.ingredients.map((ing) => (
                    <span
                      key={ing}
                      className="bg-slate-50 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-xl text-xs font-medium hover:bg-slate-100 transition-all"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Allergens Warn Alert Banner */}
            {product.allergens && product.allergens.length > 0 && (
              <div className="mb-6 bg-rose-50 border border-rose-100 rounded-2xl p-3.5 flex items-start gap-3">
                <span className="text-base leading-none">⚠️</span>
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-rose-800 uppercase tracking-wider">
                    Allergen Advisory Warning
                  </h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed mt-0.5">
                    This recipe contains or is prepared in a kitchen handling: <strong className="text-rose-900 font-bold">{product.allergens.join(', ')}</strong>. Please alert our service team for extreme dietary sensitivities.
                  </p>
                </div>
              </div>
            )}

            {/* Premium Add-ons / Dish Modifiers */}
            <div className="mb-6 border-t border-slate-100 pt-6 text-left">
              <label className="block font-display font-black text-slate-900 text-sm mb-3">
                Select Premium Add-ons
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {addons.map((addon) => {
                  const isSelected = selectedAddons.some((a) => a.id === addon.id);
                  return (
                    <button
                      type="button"
                      key={addon.id}
                      onClick={() => {
                        setSelectedAddons((prev) =>
                          isSelected
                            ? prev.filter((a) => a.id !== addon.id)
                            : [...prev, addon]
                        );
                      }}
                      className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all text-left cursor-pointer ${
                        isSelected
                          ? 'bg-orange-50 border-orange-200'
                          : 'bg-slate-50 border-slate-200 hover:border-slate-350 hover:bg-slate-100/50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 shrink-0 w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                          isSelected ? 'bg-orange-600 border-orange-600 text-white' : 'border-slate-300'
                        }`}>
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{addon.name}</h4>
                          <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">{addon.desc}</p>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-orange-600 shrink-0 ml-2">
                        +${addon.price.toFixed(2)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Special Instructions Input */}
            <div className="mb-8">
              <label className="block font-display font-black text-slate-900 text-sm mb-2 flex items-center justify-between">
                <span>Special Preparation Requests</span>
                <span className="text-xs text-slate-500 font-normal">Optional</span>
              </label>
              <textarea
                placeholder="E.g., No onions, dressing on the side, well-done, etc."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full border border-slate-200 focus:border-orange-500 focus:outline-hidden rounded-xl p-3 text-xs leading-relaxed text-slate-800 bg-slate-50 resize-none h-20 transition-all placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500/10"
                maxLength={200}
              />
            </div>

            {/* Verified Reviews Section inside Modal */}
            <div className="border-t border-slate-100 pt-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-black text-slate-900 text-base flex items-center gap-2">
                  <MessageSquare className="w-4.5 h-4.5 text-orange-600" />
                  Gourmet Reviews ({product.reviewsCount})
                </h3>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span className="text-xs font-bold font-mono text-slate-800">{product.rating} / 5.0</span>
                </div>
              </div>

              <div className="space-y-4">
                {reviews.slice(0, 3).map((rev) => (
                  <div key={rev.id} className="border border-slate-200 bg-slate-50/50 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={rev.avatar}
                          alt={rev.author}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-900">{rev.author}</span>
                            {rev.verified && (
                              <span className="bg-emerald-50 text-emerald-700 text-[9px] font-black px-1.5 py-0.5 rounded-sm border border-emerald-100 flex items-center gap-0.5">
                                Verified Gastronome
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400">{rev.date}</span>
                        </div>
                      </div>
                      
                      {/* Star Rating display */}
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-slate-600 text-xs leading-relaxed mb-3">
                      {rev.text}
                    </p>

                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => handleHelpful(rev.id)}
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-semibold border transition-all cursor-pointer ${
                          rev.userHasHelpful
                            ? 'bg-orange-50 border-orange-200 text-orange-700 font-bold'
                            : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                      >
                        Helpful ({rev.helpfulCount})
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Product Recommendations ("You may also like") */}
            <div className="border-t border-slate-100 pt-6">
              <h3 className="font-display font-black text-slate-900 text-base mb-4 tracking-tight">
                You May Also Like
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {fallbackRecommendations.map((rec) => (
                  <div
                    key={rec.id}
                    onClick={() => onSelectProduct(rec)}
                    className="group border border-slate-200 rounded-[1.5rem] overflow-hidden hover:shadow-md hover:border-orange-500/25 transition-all duration-300 cursor-pointer bg-white"
                  >
                    <div className="aspect-16/10 bg-slate-50 relative overflow-hidden rounded-[1.25rem] m-1.5 mb-0">
                      <img
                        src={rec.image}
                        alt={rec.name}
                        className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-3">
                      <h4 className="font-bold text-slate-950 text-xs group-hover:text-orange-600 transition-colors line-clamp-1 mb-0.5">
                        {rec.name}
                      </h4>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs font-bold text-slate-800">
                          ${rec.price.toFixed(2)}
                        </span>
                        <span className="text-[10px] text-slate-500 flex items-center gap-0.5 font-bold">
                          <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                          {rec.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Sticky Actions Bar at bottom (iPhone Native feel) */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-slate-100 bg-white/95 backdrop-blur-md p-4 pb-safe-bottom z-20 flex items-center gap-4 shadow-[0_-10px_30px_rgba(0,0,0,0.02)]">
          <div className="flex items-center border border-slate-200 rounded-full py-2 px-3.5 bg-slate-50">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="text-slate-500 hover:text-slate-800 cursor-pointer min-h-[30px] min-w-[30px] flex items-center justify-center active:scale-90"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-8 text-center text-sm font-bold font-mono text-slate-800 select-none">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="text-slate-500 hover:text-slate-800 cursor-pointer min-h-[30px] min-w-[30px] flex items-center justify-center active:scale-90"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={handleAdd}
            disabled={addedFeedback}
            className={`flex-1 py-3.5 px-6 rounded-full text-sm font-black transition-all cursor-pointer min-h-[44px] flex items-center justify-center gap-2 hover:shadow-lg active:scale-[0.98] ${
              addedFeedback
                ? 'bg-emerald-600 text-white border border-emerald-500/20'
                : 'bg-orange-600 hover:bg-orange-700 text-white border border-orange-500 shadow-md shadow-orange-600/10'
            }`}
          >
            {addedFeedback ? (
              <>
                <Check className="w-4 h-4 stroke-[2.5]" />
                Added to Basket!
              </>
            ) : (
              <>
                Add to Basket • ${((product.price + selectedAddons.reduce((sum, add) => sum + add.price, 0)) * quantity).toFixed(2)}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
