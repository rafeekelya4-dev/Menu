import React from 'react';
import { motion } from 'motion/react';
import { Heart, ShoppingBag, Search, ClipboardX } from 'lucide-react';

interface EmptyStateProps {
  type: 'favorites' | 'cart' | 'search' | 'no-results';
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type,
  title,
  description,
  actionText,
  onAction
}) => {
  const getDetails = () => {
    switch (type) {
      case 'favorites':
        return {
          icon: <Heart className="w-12 h-12 text-rose-400 stroke-[1.5]" />,
          title: title || 'Your Favorites is Empty',
          description: description || 'Save your favorite gourmet plates here for instant reservation or order.',
          bgColor: 'bg-rose-50/50 dark:bg-rose-950/10'
        };
      case 'cart':
        return {
          icon: <ShoppingBag className="w-12 h-12 text-amber-500 stroke-[1.5]" />,
          title: title || 'Your Cart is Empty',
          description: description || 'Explore our signature culinary creations and add something spectacular to your order.',
          bgColor: 'bg-amber-50/50 dark:bg-amber-950/10'
        };
      case 'search':
        return {
          icon: <Search className="w-12 h-12 text-slate-400 stroke-[1.5]" />,
          title: title || 'Begin Your Culinary Search',
          description: description || 'Search by dish name, premium ingredients, or category tags.',
          bgColor: 'bg-slate-50 dark:bg-slate-900/40'
        };
      case 'no-results':
      default:
        return {
          icon: <ClipboardX className="w-12 h-12 text-slate-400 stroke-[1.5]" />,
          title: title || 'No Culinary Matches',
          description: description || 'We couldn\'t find anything matching your exact search. Try adjusting filters or exploring categories.',
          bgColor: 'bg-slate-50 dark:bg-slate-900/40'
        };
    }
  };

  const details = getDetails();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="flex flex-col items-center justify-center text-center p-8 md:p-12 border border-white/10 rounded-3xl bg-white/5 backdrop-blur-md shadow-lg max-w-md mx-auto text-white"
    >
      <div className={`p-5 rounded-full ${details.bgColor} mb-6`}>
        {details.icon}
      </div>
      <h3 className="font-display text-xl font-semibold text-white mb-2">
        {details.title}
      </h3>
      <p className="text-slate-300 text-sm leading-relaxed mb-6">
        {details.description}
      </p>
      {onAction && actionText && (
        <button
          onClick={onAction}
          className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-full text-sm transition-all cursor-pointer min-h-[44px] flex items-center justify-center shadow-md"
        >
          {actionText}
        </button>
      )}
    </motion.div>
  );
};
