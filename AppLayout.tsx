import React from 'react';

interface AppLayoutProps {
  children: React.ReactNode;
  activeAccentColor: string;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, activeAccentColor }) => {
  // Map brand selections to dynamic tailwind styles or CSS variables
  const accentThemeClasses = {
    amber: '[--brand-color:#f59e0b] [--brand-hover:#d97706] [--brand-glow:rgba(245,158,11,0.15)]',
    indigo: '[--brand-color:#4f46e5] [--brand-hover:#4338ca] [--brand-glow:rgba(79,70,229,0.15)]',
    emerald: '[--brand-color:#10b981] [--brand-hover:#059669] [--brand-glow:rgba(16,185,129,0.15)]',
    rose: '[--brand-color:#e11d48] [--brand-hover:#be123c] [--brand-glow:rgba(225,29,72,0.15)]',
    purple: '[--brand-color:#9333ea] [--brand-hover:#7e22ce] [--brand-glow:rgba(147,51,234,0.15)]'
  };

  const selectedTheme = accentThemeClasses[activeAccentColor as keyof typeof accentThemeClasses] || accentThemeClasses.amber;

  return (
    <div className={`min-h-screen bg-slate-950 font-sans text-slate-300 relative ${selectedTheme}`}>
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[var(--brand-glow)] rounded-full blur-[120px] pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none translate-y-1/2" />

      {/* Main Container Wrapper */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10 flex flex-col min-h-screen">
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};
