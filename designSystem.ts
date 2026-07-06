export const DESIGN_SYSTEM = {
  theme: {
    name: 'SaaS Obsidian Luxury',
    fontFamily: {
      sans: 'Inter, sans-serif',
      display: 'Space Grotesk, sans-serif',
      mono: 'JetBrains Mono, monospace',
    },
    typography: {
      display: {
        '2xl': 'text-4xl md:text-5xl font-black tracking-tight leading-tight',
        xl: 'text-3xl md:text-4xl font-extrabold tracking-tight',
        lg: 'text-2xl md:text-3xl font-bold tracking-tight',
        md: 'text-xl font-bold',
      },
      body: {
        lg: 'text-base leading-relaxed text-slate-300',
        md: 'text-sm leading-normal text-slate-300',
        sm: 'text-xs leading-relaxed text-slate-400',
        xs: 'text-[10px] tracking-wider uppercase font-bold text-slate-500',
      },
    },
    colors: {
      // Dynamic primary color configurations
      primary: {
        amber: {
          name: 'Amber Gold',
          text: 'text-amber-400',
          bg: 'bg-amber-500',
          hover: 'hover:bg-amber-400',
          border: 'border-amber-400/20',
          accent: '#f59e0b',
        },
        indigo: {
          name: 'Royal Indigo',
          text: 'text-indigo-400',
          bg: 'bg-indigo-600',
          hover: 'hover:bg-indigo-500',
          border: 'border-indigo-500/20',
          accent: '#4f46e5',
        },
        emerald: {
          name: 'Emerald Mint',
          text: 'text-emerald-400',
          bg: 'bg-emerald-500',
          hover: 'hover:bg-emerald-400',
          border: 'border-emerald-500/20',
          accent: '#10b981',
        },
        rose: {
          name: 'Velvet Rose',
          text: 'text-rose-400',
          bg: 'bg-rose-600',
          hover: 'hover:bg-rose-500',
          border: 'border-rose-500/20',
          accent: '#e11d48',
        },
        purple: {
          name: 'Electric Violet',
          text: 'text-purple-400',
          bg: 'bg-purple-600',
          hover: 'hover:bg-purple-500',
          border: 'border-purple-500/20',
          accent: '#9333ea',
        },
      },
      neutrals: {
        slate950: '#020617', // Main deep background
        slate900: '#0f172a', // Card backgrounds
        slate800: '#1e293b', // Hover states / borders
        slate400: '#94a3b8', // Body text
        slate300: '#cbd5e1', // High contrast text
        white: '#ffffff',
      },
      feedback: {
        success: {
          text: 'text-emerald-400',
          bg: 'bg-emerald-500/10',
          border: 'border-emerald-500/20',
          solidBg: 'bg-emerald-500',
        },
        warning: {
          text: 'text-amber-400',
          bg: 'bg-amber-500/10',
          border: 'border-amber-500/20',
          solidBg: 'bg-amber-500',
        },
        error: {
          text: 'text-rose-500',
          bg: 'bg-rose-500/10',
          border: 'border-rose-500/20',
          solidBg: 'bg-rose-500',
        },
      },
    },
    spacing: {
      '2xs': '0.5', // 2px
      xs: '1',     // 4px
      sm: '2',     // 8px
      md: '4',     // 16px
      lg: '6',     // 24px
      xl: '8',     // 32px
      '2xl': '12', // 48px
      '3xl': '16', // 64px
    },
    borderRadius: {
      none: 'rounded-none',
      sm: 'rounded-sm',     // 2px
      md: 'rounded-md',     // 6px
      lg: 'rounded-lg',     // 8px
      xl: 'rounded-xl',     // 12px
      '2xl': 'rounded-2xl', // 16px
      '3xl': 'rounded-3xl', // 24px
      full: 'rounded-full',
    },
    shadows: {
      none: 'shadow-none',
      sm: 'shadow-xs',
      md: 'shadow-md',
      lg: 'shadow-lg border border-white/5',
      xl: 'shadow-2xl border border-white/10',
    },
    transitions: {
      fast: 'transition-all duration-150 ease-out',
      normal: 'transition-all duration-300 ease-in-out',
      slow: 'transition-all duration-500 ease-in-out',
    },
    iconSize: {
      sm: 'w-3.5 h-3.5',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
    },
  },
  components: {
    button: {
      variants: ['solid', 'outline', 'ghost', 'soft'],
      sizes: ['sm', 'md', 'lg'],
    },
    card: {
      variants: ['standard', 'interactive', 'featured'],
    },
    input: {
      variants: ['default', 'icon-leading', 'error'],
    },
    modal: {
      variants: ['center-fade', 'drawer-right', 'bottom-sheet'],
    },
  },
};
