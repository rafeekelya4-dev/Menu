import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sliders, Check, Wifi, WifiOff, RefreshCw, Clock, AlertTriangle } from 'lucide-react';
import { RestaurantStatus } from '../types';

interface SaaSControllerProps {
  status: RestaurantStatus;
  setStatus: (status: RestaurantStatus) => void;
  isOffline: boolean;
  setIsOffline: (offline: boolean) => void;
  isLoadingSkeleton: boolean;
  setIsLoadingSkeleton: (loading: boolean) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const SaaSController: React.FC<SaaSControllerProps> = ({
  status,
  setStatus,
  isOffline,
  setIsOffline,
  isLoadingSkeleton,
  setIsLoadingSkeleton,
  isOpen,
  setIsOpen,
}) => {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="w-80 bg-slate-950/75 backdrop-blur-xl text-white rounded-3xl shadow-2xl border border-white/10 p-5 overflow-hidden font-sans"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-400" />
                <span className="font-display font-semibold text-sm tracking-wide">
                  SaaS Simulator Controller
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-xs text-slate-300 hover:text-white px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 transition-colors cursor-pointer"
              >
                Hide
              </button>
            </div>

            {/* Restaurant Status Toggles */}
            <div className="mb-4">
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-2">
                Simulate Restaurant Status
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['open', 'busy', 'closed'] as RestaurantStatus[]).map((state) => {
                  const labelMap = {
                    open: { text: 'Open', color: 'bg-emerald-500' },
                    busy: { text: 'Busy', color: 'bg-amber-500' },
                    closed: { text: 'Closed', color: 'bg-rose-500' },
                  };
                  const active = status === state;
                  return (
                    <button
                      key={state}
                      onClick={() => setStatus(state)}
                      className={`py-2 px-1 rounded-xl text-xs font-medium flex flex-col items-center gap-1 transition-all border cursor-pointer ${
                        active
                          ? 'bg-white/15 border-white/30 text-white shadow-xs font-bold'
                          : 'bg-white/5 border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/10'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${labelMap[state].color}`} />
                      {labelMap[state].text}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Network State Toggles */}
            <div className="mb-4">
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-2">
                Simulate Connection State
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setIsOffline(false)}
                  className={`py-2 px-3 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-all border cursor-pointer ${
                    !isOffline
                      ? 'bg-emerald-500/15 border-emerald-500/35 text-emerald-400 font-bold'
                      : 'bg-white/5 border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/10'
                  }`}
                >
                  <Wifi className="w-3.5 h-3.5" />
                  Online
                </button>
                <button
                  onClick={() => setIsOffline(true)}
                  className={`py-2 px-3 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-all border cursor-pointer ${
                    isOffline
                      ? 'bg-rose-500/15 border-rose-500/35 text-rose-400 font-bold'
                      : 'bg-white/5 border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/10'
                  }`}
                >
                  <WifiOff className="w-3.5 h-3.5" />
                  Offline Error
                </button>
              </div>
            </div>

            {/* Simulated Shimmer Skeletons toggle */}
            <div className="mb-2">
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-2">
                Simulate Skeleton Loading
              </label>
              <button
                onClick={() => {
                  setIsLoadingSkeleton(true);
                  setTimeout(() => setIsLoadingSkeleton(false), 2500);
                }}
                disabled={isLoadingSkeleton}
                className={`w-full py-2 px-3 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition-all border cursor-pointer ${
                  isLoadingSkeleton
                    ? 'bg-amber-500/20 border-amber-500/30 text-amber-400'
                    : 'bg-white/5 border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/10'
                }`}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingSkeleton ? 'animate-spin' : ''}`} />
                {isLoadingSkeleton ? 'Showing 2.5s Skeletons...' : 'Trigger Skeletons (2.5s)'}
              </button>
            </div>

            <p className="text-[10px] text-slate-400 mt-3 text-center leading-relaxed">
              Use this simulation cockpit to review instant layouts of Open, Closed, Busy statuses, Error/Offline screens, and skeleton loaders.
            </p>
          </motion.div>
        ) : (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setIsOpen(true)}
            className="p-4 bg-slate-950/80 backdrop-blur-md text-white rounded-full shadow-2xl border border-white/10 hover:bg-slate-900 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
          >
            <Sliders className="w-5 h-5 text-amber-400 animate-pulse" />
            <span className="text-xs font-semibold pr-1 font-display">Simulator Tools</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};
