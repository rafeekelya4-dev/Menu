import React, { useState } from 'react';
import { motion } from 'motion/react';
import { WifiOff, RefreshCw, ServerCrash, ShieldAlert } from 'lucide-react';

interface ErrorScreenProps {
  type: 'offline' | 'server' | 'payment';
  onRetry: () => Promise<void>;
}

export const ErrorScreen: React.FC<ErrorScreenProps> = ({ type, onRetry }) => {
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryMessage, setRetryMessage] = useState<string | null>(null);

  const handleRetry = async () => {
    setIsRetrying(true);
    setRetryMessage('Pinging primary cloud servers...');
    
    // Simulate real network ping delay
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setRetryMessage('Re-establishing secure session handshake...');
    await new Promise((resolve) => setTimeout(resolve, 800));

    try {
      await onRetry();
    } catch (err) {
      setRetryMessage('Failed to connect. Retrying...');
    } finally {
      setIsRetrying(false);
      setRetryMessage(null);
    }
  };

  const getDetails = () => {
    switch (type) {
      case 'offline':
        return {
          icon: <WifiOff className="w-14 h-14 text-slate-400 stroke-[1.25]" />,
          badge: 'Offline State',
          badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
          title: 'You are currently offline',
          description: 'L’Étoile’s real-time culinary server could not be reached. Check your internet connection or toggle the preview controller.'
        };
      case 'payment':
        return {
          icon: <ShieldAlert className="w-14 h-14 text-rose-400 stroke-[1.25]" />,
          badge: 'Security Warning',
          badgeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
          title: 'Transaction Gateway Interrupted',
          description: 'The secure credit-card terminal is experiencing transient sync delays. Rest assured, your funds have not been charged.'
        };
      case 'server':
      default:
        return {
          icon: <ServerCrash className="w-14 h-14 text-rose-400 stroke-[1.25]" />,
          badge: 'Status 503',
          badgeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
          title: 'Kitchen Link Unstable',
          description: 'Our high-speed terminal had a temporary hiccup sync. Our team is already looking into this. Please retry in a moment.'
        };
    }
  };

  const details = getDetails();

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 bg-transparent">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-md w-full bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl p-8 text-center text-white"
      >
        <div className="flex justify-center mb-6">
          <div className="p-5 bg-white/5 border border-white/10 rounded-2xl relative">
            {details.icon}
            {isRetrying && (
              <span className="absolute top-1 right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            )}
          </div>
        </div>

        <div className="mb-6">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${details.badgeColor} mb-3`}>
            {details.badge}
          </span>
          <h2 className="font-display text-2xl font-bold text-white mb-2">
            {details.title}
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            {details.description}
          </p>
        </div>

        {retryMessage && (
          <motion.p
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-mono text-emerald-400 mb-5 bg-emerald-500/10 border border-emerald-500/20 py-2 px-3 rounded-lg inline-block"
          >
            {retryMessage}
          </motion.p>
        )}

        <button
          onClick={handleRetry}
          disabled={isRetrying}
          className={`w-full py-3.5 px-6 rounded-full text-sm font-medium transition-all cursor-pointer min-h-[44px] flex items-center justify-center gap-2 border ${
            isRetrying
              ? 'bg-white/5 text-white/40 cursor-not-allowed border-transparent'
              : 'bg-amber-500 hover:bg-amber-400 text-slate-950 hover:shadow-lg active:scale-[0.98] border-amber-400 font-bold'
          }`}
        >
          <RefreshCw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />
          {isRetrying ? 'Reconnecting...' : 'Retry Connection'}
        </button>
      </motion.div>
    </div>
  );
};
