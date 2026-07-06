import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, Star, Clock, Plus, Check } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  isFavorite: boolean;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onAddToCart: (product: Product, e: React.MouseEvent) => void;
  onSelect: () => void;
  isLoading?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isFavorite,
  onToggleFavorite,
  onAddToCart,
  onSelect,
  isLoading = false
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [addedFeedback, setAddedFeedback] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    onAddToCart(product, e);
    setAddedFeedback(true);
    setTimeout(() => {
      setAddedFeedback(false);
    }, 1500);
  };

  // Skeleton rendering
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col h-full animate-pulse">
        <div className="relative aspect-[16/11] sm:aspect-[4/3] bg-slate-100" />
        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="h-3 w-16 bg-slate-100 rounded" />
              <div className="h-3 w-12 bg-slate-100 rounded" />
            </div>
            <div className="h-5 bg-slate-100 rounded w-3/4" />
            <div className="space-y-1.5">
              <div className="h-3 bg-slate-100 rounded w-full" />
              <div className="h-3 bg-slate-100 rounded w-5/6" />
            </div>
          </div>
          <div className="flex items-center justify-between pt-3.5 border-t border-slate-100 mt-4">
            <div className="h-6 w-16 bg-slate-100 rounded" />
            <div className="h-9 w-9 bg-slate-100 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  const isOutOfStock = product.available === false;

  // Calculate discount percentage if originalPrice exists
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Resolve dynamic badges for popular / bestseller states
  const getBadgeInfo = () => {
    if (product.isBestseller) {
      return { text: 'Best Seller', bg: 'bg-orange-500 text-white' };
    }
    if (product.isPopularThisWeek) {
      return { text: 'Popular', bg: 'bg-rose-500 text-white' };
    }
    if (product.isChefRecommended) {
      return { text: "Chef's Choice", bg: 'bg-amber-500 text-white' };
    }
    if (product.isNewArrival) {
      return { text: 'New', bg: 'bg-emerald-600 text-white' };
    }
    return null;
  };

  const badgeInfo = getBadgeInfo();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10px' }}
      whileHover={isOutOfStock ? {} : { y: -5, transition: { duration: 0.2, ease: 'easeOut' } }}
      onClick={isOutOfStock ? undefined : onSelect}
      className={`bg-white rounded-2xl border border-slate-100/90 shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_24px_rgba(234,88,12,0.06)] transition-all duration-300 overflow-hidden flex flex-col h-full cursor-pointer group relative ${
        isOutOfStock ? 'opacity-65 cursor-not-allowed select-none' : ''
      }`}
    >
      {/* Product Image Section */}
      <div className="relative aspect-[16/11] sm:aspect-[4/3] w-full bg-slate-50 overflow-hidden">
        {/* Lazy Loading Placeholder */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-slate-100 shimmer" />
        )}
        
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Shaded overlay for badge contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/15 via-transparent to-transparent pointer-events-none" />

        {/* Sold Out Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex items-center justify-center">
            <span className="bg-rose-50 text-rose-600 border border-rose-100 text-[10px] font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
              Out of Stock
            </span>
          </div>
        )}

        {/* Favorite Heart Button Overlay */}
        {!isOutOfStock && (
          <button
            onClick={(e) => onToggleFavorite(product.id, e)}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/95 hover:bg-white shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.12)] transition-all duration-200 cursor-pointer w-9 h-9 flex items-center justify-center active:scale-90 hover:scale-105 z-10 border border-slate-100/50"
            aria-label="Toggle Favorite"
          >
            <motion.div
              animate={{ scale: isFavorite ? [1, 1.25, 1] : 1 }}
              transition={{ duration: 0.25 }}
            >
              <Heart
                className={`w-4 h-4 transition-colors duration-200 ${
                  isFavorite
                    ? 'fill-rose-500 text-rose-500'
                    : 'text-slate-400 group-hover:text-rose-500'
                }`}
              />
            </motion.div>
          </button>
        )}

        {/* Floating Tags & Promo Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {badgeInfo && (
            <span className={`text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-lg shadow-sm ${badgeInfo.bg}`}>
              {badgeInfo.text}
            </span>
          )}
          {discountPercent > 0 && !isOutOfStock && (
            <span className="bg-red-500 text-white text-[9px] font-extrabold px-2.5 py-1 rounded-lg shadow-sm uppercase tracking-wider">
              {discountPercent}% OFF
            </span>
          )}
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata Row: Category & Calories */}
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
            <span className="text-orange-600 font-extrabold">{product.category}</span>
            {product.calories && (
              <span className="font-mono text-slate-400 flex items-center gap-0.5 font-semibold">
                🔥 {product.calories} kcal
              </span>
            )}
          </div>

          {/* Product Name */}
          <h3 className="font-sans font-bold text-slate-900 text-sm sm:text-base leading-snug group-hover:text-orange-600 transition-colors duration-200 mb-1 line-clamp-1">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 mb-3 min-h-[32px]">
            {product.description}
          </p>

          {/* Cooking Time & Ratings Row */}
          <div className="flex items-center gap-3 text-xs text-slate-500 mb-3.5 flex-wrap">
            <div className="flex items-center gap-1 bg-amber-500/10 text-amber-700 px-2 py-0.5 rounded-lg font-bold font-mono text-[10px]">
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
              <span>{product.rating}</span>
            </div>
            <div className="flex items-center gap-1 text-slate-500 font-semibold text-[11px]">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{product.prepTime} mins</span>
            </div>
            {product.spiceLevel !== undefined && product.spiceLevel > 0 && (
              <span className="text-[11px] font-medium text-rose-500 flex items-center">
                🌶️{'🔥'.repeat(product.spiceLevel)}
              </span>
            )}
          </div>

          {/* Protein & Allergens Row if any */}
          {(product.protein || (product.allergens && product.allergens.length > 0)) && (
            <div className="flex items-center gap-2 mb-3 pt-1 text-[10px] text-slate-400 font-medium border-t border-slate-50">
              {product.protein && (
                <span className="bg-slate-50 border border-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-mono">
                  💪 {product.protein} Protein
                </span>
              )}
              {product.allergens && product.allergens.length > 0 && (
                <span className="truncate max-w-[120px]">
                  Allergens: {product.allergens.slice(0, 1).join(', ')}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Card Actions Footer */}
        <div className="flex items-center justify-between pt-3.5 border-t border-slate-100 mt-auto">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="font-sans font-black text-orange-600 text-base sm:text-lg">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-slate-400 line-through text-xs font-normal">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-slate-400 font-normal mt-0.5">
              ({product.reviewsCount} reviews)
            </span>
          </div>

          {/* Circle orange Add Button at the bottom-right */}
          <button
            onClick={isOutOfStock ? undefined : handleAddToCart}
            disabled={isOutOfStock}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-200 shadow-md active:scale-95 hover:scale-105 cursor-pointer border border-transparent ${
              isOutOfStock
                ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                : addedFeedback
                ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                : 'bg-orange-600 hover:bg-orange-700 text-white shadow-orange-500/20 group-hover:scale-105'
            }`}
            title={isOutOfStock ? "Sold Out" : "Add to Cart"}
          >
            {addedFeedback ? (
              <Check className="w-4 h-4 stroke-[3.5] animate-bounce" />
            ) : (
              <Plus className="w-4 h-4 stroke-[3.5] transition-transform duration-200 group-hover:rotate-90" />
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};
