import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Navigation, Truck, RefreshCw, Send, ShieldCheck, HelpCircle } from 'lucide-react';

interface LocationNode {
  id: string;
  name: string;
  latOffset: number; // For SVG mapping
  lngOffset: number; // For SVG mapping
  distance: number; // miles
  time: number; // min
  fee: number; // USD
}

const PRESET_DESTINATIONS: LocationNode[] = [
  { id: 'dest-1', name: 'Carnegie Hall Penthouse', latOffset: 150, lngOffset: 120, distance: 0.8, time: 15, fee: 4.99 },
  { id: 'dest-2', name: 'Central Park South Residences', latOffset: 110, lngOffset: 210, distance: 1.2, time: 18, fee: 4.99 },
  { id: 'dest-3', name: 'Sutton Place Estate', latOffset: 220, lngOffset: 340, distance: 1.5, time: 22, fee: 6.50 },
  { id: 'dest-4', name: 'Midtown Executive Towers', latOffset: 290, lngOffset: 180, distance: 0.9, time: 16, fee: 4.99 },
  { id: 'dest-5', name: 'Metropolitan Museum Penthouse', latOffset: 60, lngOffset: 280, distance: 2.3, time: 28, fee: 8.50 }
];

export const RestaurantMap: React.FC = () => {
  const [selectedDest, setSelectedDest] = useState<LocationNode>(PRESET_DESTINATIONS[0]);
  const [customAddress, setCustomAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [courierPosition, setCourierPosition] = useState(0); // 0 to 100 percentage along the route

  // Animate the courier along the route
  useEffect(() => {
    const interval = setInterval(() => {
      setCourierPosition((prev) => (prev >= 100 ? 0 : prev + 1.5));
    }, 100);
    return () => clearInterval(interval);
  }, [selectedDest]);

  const handleApplyAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customAddress.trim()) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Simulate creating a new custom node
      const randomSeed = Math.random();
      const newDest: LocationNode = {
        id: 'dest-custom',
        name: customAddress,
        latOffset: 80 + Math.floor(randomSeed * 200),
        lngOffset: 100 + Math.floor(randomSeed * 220),
        distance: Number((0.5 + randomSeed * 3).toFixed(1)),
        time: Math.floor(12 + randomSeed * 25),
        fee: randomSeed > 0.6 ? 0.00 : 4.99 // Complimentary randomly
      };
      setSelectedDest(newDest);
      setCustomAddress('');
    }, 850);
  };

  // Restaurant Source coordinates: 450 Park Avenue (center of map)
  const restX = 200;
  const restY = 200;
  const destX = selectedDest.lngOffset;
  const destY = selectedDest.latOffset;

  return (
    <div className="w-full bg-slate-950 border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row h-[500px]">
      
      {/* Map Display (Left Side) */}
      <div className="flex-1 relative bg-slate-900 border-b lg:border-b-0 lg:border-r border-white/10 overflow-hidden select-none">
        
        {/* Abstract Map Grid Lines & Background Elements */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }} />

        {/* Outer concentric delivery zone rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] rounded-full border border-amber-400/5 pointer-events-none animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full border border-amber-400/10 pointer-events-none" />

        {/* Map Vector Roads (Decorative SVG lines) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
          <defs>
            <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* Major Streets */}
          <line x1="0" y1="200" x2="600" y2="200" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
          <line x1="200" y1="0" x2="200" y2="500" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
          
          <line x1="0" y1="100" x2="600" y2="100" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
          <line x1="0" y1="300" x2="600" y2="300" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
          <line x1="100" y1="0" x2="100" y2="500" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
          <line x1="300" y1="0" x2="300" y2="500" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />

          {/* Diagonals (e.g. Broadway) */}
          <line x1="0" y1="400" x2="400" y2="0" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />

          {/* Active Delivery Route Line (Slightly curved) */}
          <path
            d={`M ${restX} ${restY} Q ${(restX + destX) / 2 + 30} ${(restY + destY) / 2 - 20} ${destX} ${destY}`}
            fill="none"
            stroke="url(#routeGradient)"
            strokeWidth="3.5"
            strokeDasharray="6 4"
            className="animate-[dash_10s_linear_infinite]"
          />
        </svg>

        {/* Central Park Simulation Grid (Green block indicator) */}
        <div className="absolute top-4 left-4 w-28 h-40 bg-emerald-950/20 rounded-2xl border border-emerald-500/10 flex items-center justify-center pointer-events-none">
          <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-600">Central Park</span>
        </div>

        {/* East River block indicator */}
        <div className="absolute bottom-4 right-4 w-24 h-24 bg-blue-950/20 rounded-2xl border border-blue-500/10 flex items-center justify-center pointer-events-none">
          <span className="text-[10px] uppercase font-bold tracking-widest text-blue-600">East River</span>
        </div>

        {/* RESTAURANT SOURCE PIN */}
        <div
          style={{ left: restX, top: restY }}
          className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-amber-400 rounded-full animate-ping opacity-60 scale-150" />
            <div className="w-10 h-10 bg-slate-950 border-2 border-amber-400 text-amber-400 rounded-full flex items-center justify-center shadow-lg cursor-help group" title="L'Etoile HQ (450 Park Ave)">
              <Navigation className="w-5 h-5 fill-amber-400/20 rotate-45" />
            </div>
          </div>
          <span className="mt-1.5 px-2.5 py-0.5 bg-slate-950/90 border border-amber-400/20 text-white rounded-md text-[9px] font-bold tracking-wide uppercase shadow-md">
            L'Étoile HQ
          </span>
        </div>

        {/* COURIER SCUTTLE SCOOTER (Translates between source and dest) */}
        <div
          style={{
            left: restX + (destX - restX) * (courierPosition / 100),
            top: restY + (destY - restY) * (courierPosition / 100) - (Math.sin((courierPosition / 100) * Math.PI) * 20),
          }}
          className="absolute -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none transition-all duration-100"
        >
          <div className="p-1.5 bg-amber-400 text-slate-950 rounded-full shadow-lg border border-white">
            <Truck className="w-3.5 h-3.5 animate-bounce" />
          </div>
        </div>

        {/* DELIVERY DESTINATION PIN */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedDest.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            style={{ left: destX, top: destY }}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-rose-500 rounded-full animate-ping opacity-40 scale-125" />
              <div className="w-8 h-8 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-lg border border-white">
                <MapPin className="w-4 h-4 fill-white/10" />
              </div>
            </div>
            <span className="mt-1.5 px-2 py-0.5 bg-slate-950/90 border border-white/10 text-white rounded-md text-[9px] font-bold shadow-md whitespace-nowrap">
              {selectedDest.name}
            </span>
          </motion.div>
        </AnimatePresence>

        {/* Preset Interactive Pins overlay */}
        {PRESET_DESTINATIONS.map((dest) => (
          <button
            key={dest.id}
            onClick={() => setSelectedDest(dest)}
            style={{ left: dest.lngOffset, top: dest.latOffset }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border border-white hover:scale-125 cursor-pointer transition-all z-0 ${
              selectedDest.id === dest.id 
                ? 'bg-rose-500 scale-110 opacity-0 pointer-events-none' 
                : 'bg-white/20 hover:bg-white'
            }`}
            title={`Check dispatch to ${dest.name}`}
          />
        ))}

        {/* Map Watermark overlay */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10 text-[9px] font-semibold text-slate-400 uppercase tracking-widest pointer-events-none">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Interactive Dispatch Radar (Upper Manhattan)
        </div>
      </div>

      {/* Control / Analytics Console (Right Side) */}
      <div className="w-full lg:w-80 bg-slate-950 p-5 flex flex-col justify-between overflow-y-auto">
        
        {/* Info Column */}
        <div className="space-y-4">
          <div>
            <h4 className="font-display font-bold text-white text-sm flex items-center gap-2">
              <Truck className="w-4 h-4 text-amber-400" />
              White-Glove Courier Check
            </h4>
            <p className="text-slate-400 text-[11px] mt-0.5">
              Simulate dispatch speeds, delivery distances, and gourmet transport times directly from our Park Avenue kitchen.
            </p>
          </div>

          {/* Quick Select Buttons */}
          <div className="space-y-1.5">
            <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Select Preset Estates
            </span>
            <div className="grid grid-cols-1 gap-1.5 max-h-36 overflow-y-auto pr-1">
              {PRESET_DESTINATIONS.map((dest) => {
                const active = selectedDest.id === dest.id;
                return (
                  <button
                    key={dest.id}
                    onClick={() => setSelectedDest(dest)}
                    className={`w-full px-3 py-1.5 rounded-xl text-left text-xs transition-all flex items-center justify-between border ${
                      active
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 font-bold'
                        : 'bg-white/5 border-transparent text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <span className="truncate">{dest.name}</span>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0">
                      {dest.distance} mi
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Address Simulator */}
          <form onSubmit={handleApplyAddress} className="space-y-1.5 pt-1.5 border-t border-white/5">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Simulate Custom Location
            </label>
            <div className="flex gap-1.5">
              <input
                type="text"
                placeholder="E.g., 5th Ave Penthouse..."
                value={customAddress}
                onChange={(e) => setCustomAddress(e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:border-amber-400 text-white placeholder:text-slate-500"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center transition-all disabled:opacity-50"
              >
                {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              </button>
            </div>
          </form>
        </div>

        {/* Live Calculation Output Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3 mt-4">
          <div className="flex justify-between items-center pb-2 border-b border-white/5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Calculation Output
            </span>
            <div className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-sm text-[8px] font-black uppercase">
              <ShieldCheck className="w-2.5 h-2.5" />
              Inside Zone
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Distance
              </span>
              <span className="text-sm font-bold font-mono text-white">
                {selectedDest.distance} mi
              </span>
            </div>
            <div className="border-x border-white/5">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Travel Time
              </span>
              <span className="text-sm font-bold font-mono text-amber-400">
                {selectedDest.time} mins
              </span>
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Courier Fee
              </span>
              <span className="text-sm font-bold font-mono text-white">
                {selectedDest.fee === 0 ? 'FREE' : `$${selectedDest.fee.toFixed(2)}`}
              </span>
            </div>
          </div>

          <p className="text-[9px] text-slate-500 text-center leading-relaxed font-light">
            Hermetic humidor containers guarantee exact kitchen temperatures. Safe arrival backed by delivery protection.
          </p>
        </div>

      </div>

    </div>
  );
};
