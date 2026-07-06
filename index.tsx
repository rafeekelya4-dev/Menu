import React, { forwardRef } from 'react';
import { motion } from 'motion/react';
import { Loader2 } from 'lucide-react';

// ==========================================
// 1. BUTTON COMPONENT
// ==========================================
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'solid' | 'outline' | 'ghost' | 'soft' | 'amber' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'solid',
  size = 'md',
  loading = false,
  icon,
  className = '',
  children,
  ...props
}, ref) => {
  const baseStyle = "relative inline-flex items-center justify-center font-display font-bold rounded-full transition-all duration-200 outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 cursor-pointer select-none disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";
  
  const variantStyles = {
    solid: "bg-white text-slate-950 hover:bg-slate-100 focus:ring-white",
    outline: "bg-transparent border border-white/10 text-white hover:bg-white/5 hover:border-white/20 focus:ring-white/20",
    ghost: "bg-transparent text-slate-300 hover:text-white hover:bg-white/5 focus:ring-white/10",
    soft: "bg-white/10 text-white hover:bg-white/15 focus:ring-white/20",
    amber: "bg-amber-500 text-slate-950 hover:bg-amber-400 focus:ring-amber-400",
    danger: "bg-rose-600 text-white hover:bg-rose-500 focus:ring-rose-500"
  };

  const sizeStyles = {
    sm: "px-3.5 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-7 py-3.5 text-base"
  };

  return (
    <button
      ref={ref}
      className={`${baseStyle} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && (
        <Loader2 className="w-4 h-4 mr-2 animate-spin shrink-0" />
      )}
      {!loading && icon && (
        <span className="mr-2 shrink-0">{icon}</span>
      )}
      <span>{children}</span>
    </button>
  );
});

Button.displayName = 'Button';


// ==========================================
// 2. CARD COMPONENT
// ==========================================
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'standard' | 'interactive' | 'featured';
}

export const Card: React.FC<CardProps> = ({
  variant = 'standard',
  className = '',
  children,
  ...props
}) => {
  const baseStyle = "bg-white/5 border border-white/10 rounded-3xl p-5 overflow-hidden transition-all duration-300";
  
  const variantStyles = {
    standard: "shadow-lg",
    interactive: "shadow-md hover:bg-white/8 hover:border-white/15 cursor-pointer hover:-translate-y-0.5 hover:shadow-xl",
    featured: "bg-gradient-to-br from-amber-500/10 to-indigo-500/5 border border-amber-500/20 shadow-xl"
  };

  return (
    <div
      className={`${baseStyle} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};


// ==========================================
// 3. INPUT COMPONENT
// ==========================================
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  icon,
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className="space-y-1.5 text-left w-full">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-bold text-slate-400 uppercase tracking-widest">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 shrink-0">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          ref={ref}
          className={`w-full ${icon ? 'pl-11' : 'pl-4'} pr-4 py-3 bg-white/5 border ${error ? 'border-rose-500/50 focus:border-rose-500' : 'border-white/10 focus:border-white/25'} text-sm text-white placeholder-slate-500 rounded-2xl outline-none focus:ring-1 ${error ? 'focus:ring-rose-500' : 'focus:ring-white/20'} transition-all ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="text-[11px] font-medium text-rose-400 font-mono tracking-tight text-left">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';


// ==========================================
// 4. BADGE COMPONENT
// ==========================================
interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'error' | 'info' | 'primary' | 'neutral';
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  className = '',
  children,
  ...props
}) => {
  const baseStyle = "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider font-mono border";
  
  const variantStyles = {
    neutral: "bg-white/5 border-white/10 text-slate-400",
    primary: "bg-amber-500/10 border-amber-500/20 text-amber-400",
    success: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
    warning: "bg-amber-500/10 border-amber-500/25 text-amber-500",
    error: "bg-rose-500/10 border-rose-500/20 text-rose-400",
    info: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
  };

  return (
    <span
      className={`${baseStyle} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};


// ==========================================
// 5. AVATAR COMPONENT
// ==========================================
interface AvatarProps {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  id?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = 'md',
  className = '',
  id,
}) => {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const sizeStyles = {
    sm: "w-8 h-8 text-xs",
    md: "w-11 h-11 text-sm",
    lg: "w-14 h-14 text-base"
  };

  return (
    <div
      id={id}
      className={`relative shrink-0 rounded-full overflow-hidden border border-white/15 bg-slate-800 text-white font-display font-bold flex items-center justify-center ${sizeStyles[size]} ${className}`}
    >
      {src ? (
        <img src={src} alt={name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
};


// ==========================================
// 6. TAG COMPONENT
// ==========================================
interface TagProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export const Tag: React.FC<TagProps> = ({
  children,
  className = '',
  id,
}) => {
  return (
    <span
      id={id}
      className={`inline-flex items-center px-2 py-0.5 rounded-lg bg-slate-900 border border-white/5 text-[10px] font-medium text-slate-300 font-mono ${className}`}
    >
      {children}
    </span>
  );
};


// ==========================================
// 7. COUNTER COMPONENT
// ==========================================
interface CounterProps {
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md';
  id?: string;
}

export const Counter: React.FC<CounterProps> = ({
  value,
  onChange,
  min = 1,
  max = 99,
  size = 'md',
  id,
}) => {
  const handleDecrement = () => {
    if (value > min) onChange(value - 1);
  };

  const handleIncrement = () => {
    if (value < max) onChange(value + 1);
  };

  const sizeStyles = {
    sm: {
      btn: "w-7 h-7 text-xs",
      container: "gap-1.5 p-0.5",
      text: "w-6 text-xs font-bold"
    },
    md: {
      btn: "w-9 h-9 text-sm",
      container: "gap-3 p-1",
      text: "w-8 text-sm font-black"
    }
  };

  return (
    <div
      id={id}
      className={`inline-flex items-center bg-slate-900 border border-white/10 rounded-full ${sizeStyles[size].container}`}
    >
      <button
        type="button"
        onClick={handleDecrement}
        disabled={value <= min}
        className={`rounded-full hover:bg-white/5 border border-transparent active:border-white/10 text-slate-300 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center cursor-pointer transition-colors ${sizeStyles[size].btn}`}
      >
        —
      </button>
      <span className={`text-center font-mono text-white ${sizeStyles[size].text}`}>
        {value}
      </span>
      <button
        type="button"
        onClick={handleIncrement}
        disabled={value >= max}
        className={`rounded-full hover:bg-white/5 border border-transparent active:border-white/10 text-slate-300 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center cursor-pointer transition-colors ${sizeStyles[size].btn}`}
      >
        +
      </button>
    </div>
  );
};


// ==========================================
// 8. TABS COMPONENT
// ==========================================
interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
  id?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className = '',
  id,
}) => {
  return (
    <div
      id={id}
      className={`flex border-b border-white/10 overflow-x-auto ${className}`}
    >
      {tabs.map((tab) => {
        const active = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`py-3.5 px-4 font-display text-xs font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 outline-none ${
              active
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};


// ==========================================
// 9. LOADING SKELETON
// ==========================================
interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rect' | 'circle';
  id?: string;
}

export const LoadingSkeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rect',
  id,
}) => {
  const variantStyles = {
    text: "h-3.5 w-3/4 rounded-md",
    rect: "rounded-2xl",
    circle: "rounded-full"
  };

  return (
    <div
      id={id}
      className={`relative overflow-hidden bg-white/[0.04] dark-shimmer ${variantStyles[variant]} ${className}`}
    />
  );
};


// ==========================================
// 10. CHECKBOX & RADIO COMPONENTS
// ==========================================
interface SelectionProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Checkbox: React.FC<SelectionProps> = ({
  label,
  className = '',
  id,
  ...props
}) => {
  const selectId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <label htmlFor={selectId} className="flex items-center gap-3 cursor-pointer select-none text-left">
      <input
        id={selectId}
        type="checkbox"
        className={`w-5 h-5 rounded-md border border-white/15 bg-white/5 text-amber-500 focus:ring-1 focus:ring-amber-500/50 outline-none accent-amber-500 cursor-pointer ${className}`}
        {...props}
      />
      {label && <span className="text-xs text-slate-300 font-medium">{label}</span>}
    </label>
  );
};

export const Radio: React.FC<SelectionProps> = ({
  label,
  className = '',
  id,
  ...props
}) => {
  const selectId = id || `radio-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <label htmlFor={selectId} className="flex items-center gap-3 cursor-pointer select-none text-left">
      <input
        id={selectId}
        type="radio"
        className={`w-5 h-5 rounded-full border border-white/15 bg-white/5 text-amber-500 focus:ring-1 focus:ring-amber-500/50 outline-none accent-amber-500 cursor-pointer ${className}`}
        {...props}
      />
      {label && <span className="text-xs text-slate-300 font-medium">{label}</span>}
    </label>
  );
};


// ==========================================
// 11. SEARCH INPUT COMPONENT
// ==========================================
interface SearchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchProps>(({
  onClear,
  className = '',
  value,
  ...props
}, ref) => {
  return (
    <div className="relative w-full">
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
      </div>
      <input
        ref={ref}
        value={value}
        className={`w-full pl-10 pr-10 py-2.5 text-xs bg-white/5 border border-white/10 rounded-full text-white placeholder:text-slate-500 focus:outline-none focus:border-white/20 transition-all ${className}`}
        {...props}
      />
      {value && onClear && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white rounded-full bg-white/5 transition-colors cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
});
SearchInput.displayName = 'SearchInput';


// ==========================================
// 12. DRAWER COMPONENT
// ==========================================
interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  children
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div onClick={onClose} className="absolute inset-0 bg-slate-950/75 backdrop-blur-md" />
      {/* Drawer */}
      <div className="relative bg-slate-950/90 backdrop-blur-2xl w-full max-w-md h-full shadow-2xl flex flex-col z-10 border-l border-white/10 text-white animate-slide-left">
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <h3 className="font-display font-bold text-white text-base">{title}</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
};


// ==========================================
// 13. BOTTOM SHEET COMPONENT
// ==========================================
interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  children
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div onClick={onClose} className="absolute inset-0 bg-slate-950/75 backdrop-blur-md" />
      {/* Content */}
      <div className="relative bg-slate-900 border-t border-white/10 rounded-t-[32px] w-full max-w-xl max-h-[85vh] flex flex-col z-10 overflow-hidden text-white">
        <div className="flex justify-center py-3 cursor-pointer" onClick={onClose}>
          <div className="w-12 h-1.5 bg-white/20 rounded-full" />
        </div>
        <div className="px-6 pb-4 border-b border-white/5 flex items-center justify-between">
          <h3 className="font-display font-bold text-white text-base">{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
};


// ==========================================
// 14. DROPDOWN COMPONENT
// ==========================================
interface DropdownItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  danger?: boolean;
}

interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  onSelect: (id: string) => void;
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  onSelect,
  className = ''
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer select-none">
        {trigger}
      </div>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-52 bg-slate-900 border border-white/10 rounded-2xl p-1.5 shadow-2xl z-50 text-left">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onSelect(item.id);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                item.danger
                  ? 'text-rose-400 hover:bg-rose-500/10 hover:text-rose-300'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              {item.icon && <span className="shrink-0 text-slate-400">{item.icon}</span>}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};


// ==========================================
// 15. FLOATING ACTION BUTTON (FAB)
// ==========================================
interface FloatingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  badgeCount?: number;
}

export const FloatingButton: React.FC<FloatingButtonProps> = ({
  icon,
  badgeCount,
  className = '',
  ...props
}) => {
  return (
    <button
      className={`fixed bottom-6 right-6 p-4 rounded-full bg-amber-500 text-slate-950 hover:bg-amber-400 transition-all duration-300 shadow-2xl border border-amber-400 active:scale-95 cursor-pointer flex items-center justify-center z-40 group ${className}`}
      {...props}
    >
      {icon}
      {badgeCount !== undefined && badgeCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-extrabold font-mono h-5 w-5 rounded-full flex items-center justify-center border-2 border-slate-950 group-hover:scale-110 transition-transform">
          {badgeCount}
        </span>
      )}
    </button>
  );
};

