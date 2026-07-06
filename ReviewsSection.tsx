import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Check, Award, ThumbsUp, Calendar, Filter } from 'lucide-react';
import { Review } from '../types';

interface ReviewsSectionProps {
  reviews: Review[];
  onHelpfulClick: (id: string) => void;
  averageRating: number;
  totalReviews: number;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  reviews,
  onHelpfulClick,
  averageRating,
  totalReviews
}) => {
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');

  // Filter reviews by rating
  const filteredReviews = filterRating === 'all'
    ? reviews
    : reviews.filter((r) => r.rating === filterRating);

  // Math counts for visual bars
  const fiveStarsCount = reviews.filter((r) => r.rating === 5).length;
  const fourStarsCount = reviews.filter((r) => r.rating === 4).length;
  const otherStarsCount = reviews.filter((r) => r.rating < 4).length;

  return (
    <div className="w-full bg-white border border-slate-200 rounded-[2.25rem] p-6 md:p-8 text-slate-800 shadow-[0_10px_40px_rgba(0,0,0,0.02)]">
      {/* Section Title */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-6">
        <div>
          <h2 className="font-display font-black text-slate-950 text-xl md:text-2xl tracking-tight flex items-center gap-2">
            <Award className="w-6 h-6 text-orange-600 animate-pulse" />
            Verified Customer Reviews
          </h2>
          <p className="text-slate-500 text-xs mt-1">
            Real experiences from distinguished gastronomes
          </p>
        </div>

        {/* Live Filter selector */}
        <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200/60 backdrop-blur-md scale-90 md:scale-100 origin-left">
          <button
            onClick={() => setFilterRating('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
              filterRating === 'all'
                ? 'bg-orange-600 text-white shadow-xs font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Guestbook
          </button>
          {[5, 4].map((star) => (
            <button
              key={star}
              onClick={() => setFilterRating(star)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all flex items-center gap-1 ${
                filterRating === star
                  ? 'bg-orange-600 text-white shadow-xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {star} ★
            </button>
          ))}
        </div>
      </div>

      {/* Grid: Stats Column & List Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Stats card */}
        <div className="lg:col-span-4 bg-slate-50 border border-slate-200/60 rounded-2xl p-5 flex flex-col justify-center text-center shadow-xs">
          <span className="text-4xl md:text-5xl font-display font-black text-slate-950 font-mono">
            {averageRating.toFixed(1)}
          </span>
          
          <div className="flex justify-center gap-0.5 my-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className="w-5 h-5 text-amber-500 fill-amber-500"
              />
            ))}
          </div>

          <p className="text-xs text-slate-500 font-bold">
            Based on {totalReviews} gourmet checkouts
          </p>

          {/* Mini Percentage Bar block */}
          <div className="space-y-2 mt-5 text-left text-xs">
            <div className="space-y-1">
              <div className="flex justify-between font-bold text-slate-600 text-[11px]">
                <span>Exceptional (5 ★)</span>
                <span className="font-mono font-black">
                  {reviews.length > 0 ? Math.round((fiveStarsCount / reviews.length) * 100) : 0}%
                </span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-orange-600 h-full rounded-full"
                  style={{ width: `${reviews.length > 0 ? (fiveStarsCount / reviews.length) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between font-bold text-slate-600 text-[11px]">
                <span>Very Good (4 ★)</span>
                <span className="font-mono font-black">
                  {reviews.length > 0 ? Math.round((fourStarsCount / reviews.length) * 100) : 0}%
                </span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-orange-400 h-full rounded-full"
                  style={{ width: `${reviews.length > 0 ? (fourStarsCount / reviews.length) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Reviews List column */}
        <div className="lg:col-span-8 space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredReviews.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-slate-55 border border-slate-200 rounded-2xl p-8 text-center text-slate-500 text-sm font-medium"
              >
                No reviews found matching your current filter.
              </motion.div>
            ) : (
              filteredReviews.map((rev) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  key={rev.id}
                  className="bg-white border border-slate-200 rounded-[1.75rem] p-5 shadow-[0_4px_12px_rgba(0,0,0,0.01)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.04)] hover:border-orange-500/20 transition-all duration-300 relative"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={rev.avatar}
                        alt={rev.author}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-black text-slate-900 text-sm">{rev.author}</h4>
                          {rev.verified && (
                            <span className="bg-emerald-50 text-emerald-700 text-[9px] font-black px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-0.5">
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                              Verified Patron
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono">
                          <Calendar className="w-3 h-3" />
                          <span>{rev.date}</span>
                        </div>
                      </div>
                    </div>

                    {/* Star Row */}
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < rev.rating
                              ? 'text-amber-500 fill-amber-500'
                              : 'text-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-slate-650 text-xs leading-relaxed mb-4 font-light">
                    {rev.text}
                  </p>

                  <div className="flex justify-between items-center border-t border-slate-100 pt-3">
                    <span className="text-[10px] font-mono text-slate-400">
                      Gourmet feedback ID: #{rev.id}
                    </span>
                    <button
                      onClick={() => onHelpfulClick(rev.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold border transition-all cursor-pointer min-h-[30px] ${
                        rev.userHasHelpful
                          ? 'bg-orange-50 border-orange-200 text-orange-700 font-black scale-[1.03]'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <ThumbsUp className={`w-3 h-3 ${rev.userHasHelpful ? 'fill-orange-600' : ''}`} />
                      Helpful? • {rev.helpfulCount}
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
