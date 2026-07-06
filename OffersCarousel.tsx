import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Percent, Truck, Gift, Clock, Sparkles, Copy, Check } from 'lucide-react';
import { Offer } from '../types';

interface OffersCarouselProps {
  offers: Offer[];
  onApplyCode: (code: string) => void;
  activeCode: string | null;
}

export const OffersCarousel: React.FC<OffersCarouselProps> = ({
  offers,
  onApplyCode,
  activeCode
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleClaim = (offer: Offer) => {
    onApplyCode(offer.code);
    setCopiedId(offer.id);
    navigator.clipboard.writeText(offer.code);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  return (
    <div className="w-full py-2 text-slate-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-orange-600 fill-orange-600/10 animate-bounce" />
          <h2 className="font-display text-xl font-black text-slate-950 tracking-tight">
            Exclusive Culinary Offers
          </h2>
        </div>
        <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">
          Limited reservations available
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 overflow-x-auto pb-2 scroll-smooth">
        {offers.map((offer, index) => (
          <OfferCard
            key={offer.id}
            offer={offer}
            index={index}
            copiedId={copiedId}
            activeCode={activeCode}
            onClaim={handleClaim}
          />
        ))}
      </div>
    </div>
  );
};

interface OfferCardProps {
  offer: Offer;
  index: number;
  copiedId: string | null;
  activeCode: string | null;
  onClaim: (offer: Offer) => void;
}

const OfferCard: React.FC<OfferCardProps> = ({
  offer,
  index,
  copiedId,
  activeCode,
  onClaim
}) => {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(offer.expiresAt) - +new Date();
      if (difference <= 0) {
        return { hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    };

    // Initial run
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [offer.expiresAt]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'percentage':
        return <Percent className="w-5 h-5 text-indigo-600" />;
      case 'free_delivery':
        return <Truck className="w-5 h-5 text-emerald-600" />;
      case 'bogo':
      default:
        return <Gift className="w-5 h-5 text-rose-500" />;
    }
  };

  const getBgStyle = (index: number) => {
    const colors = [
      'border-indigo-100 bg-indigo-50/50 hover:bg-indigo-50',
      'border-emerald-100 bg-emerald-50/50 hover:bg-emerald-50',
      'border-orange-100 bg-orange-50/50 hover:bg-orange-50'
    ];
    return colors[index % colors.length];
  };

  const isApplied = activeCode === offer.code;
  const isCopied = copiedId === offer.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, scale: 1.018 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className={`border rounded-[1.75rem] p-5.5 relative overflow-hidden flex flex-col justify-between ${getBgStyle(
        index
      )} h-full shadow-[0_8px_30px_rgba(0,0,0,0.02)] hover:shadow-lg transition-all duration-300`}
    >
      {/* Badge */}
      <div className="flex justify-between items-start mb-3">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/85 border border-slate-200 text-slate-700 shadow-xs">
          {offer.badgeText}
        </span>
        <div className="p-2 bg-white rounded-xl shadow-xs border border-slate-100">
          {getIcon(offer.type)}
        </div>
      </div>

      <div>
        <h3 className="font-display font-black text-slate-900 text-lg leading-tight mb-1.5">
          {offer.title}
        </h3>
        <p className="text-slate-600 text-xs leading-relaxed mb-4 font-light">
          {offer.description}
        </p>
      </div>

      {/* Countdown Timer */}
      <div className="flex items-center gap-3 border-t border-slate-200/60 pt-3.5 mt-auto">
        <div className="flex items-center gap-1 text-slate-500 font-bold uppercase tracking-wider">
          <Clock className="w-3.5 h-3.5" />
          <span className="text-[10px]">Ends in:</span>
        </div>
        <div className="flex items-center gap-1 text-xs font-mono font-bold text-slate-700">
          <span className="bg-white text-slate-900 px-1.5 py-0.5 rounded border border-slate-200">
            {String(timeLeft.hours).padStart(2, '0')}
          </span>
          <span>:</span>
          <span className="bg-white text-slate-900 px-1.5 py-0.5 rounded border border-slate-200">
            {String(timeLeft.minutes).padStart(2, '0')}
          </span>
          <span>:</span>
          <span className="bg-white text-slate-900 px-1.5 py-0.5 rounded border border-slate-200">
            {String(timeLeft.seconds).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Promo Code claim trigger */}
      <button
        onClick={() => onClaim(offer)}
        className={`mt-4 w-full py-2.5 px-4 rounded-xl text-xs font-black cursor-pointer min-h-[44px] flex items-center justify-center gap-2 transition-all border ${
          isApplied
            ? 'bg-orange-600 text-white font-black border-orange-500 shadow-md shadow-orange-600/10'
            : isCopied
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
            : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-xs'
        }`}
      >
        {isApplied ? (
          <>
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            Applied: {offer.code}
          </>
        ) : isCopied ? (
          <>
            <Check className="w-3.5 h-3.5" />
            Copied & Applied!
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5" />
            Claim: {offer.code}
          </>
        )}
      </button>
    </motion.div>
  );
};
