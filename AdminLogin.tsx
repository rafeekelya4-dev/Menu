import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, ShieldCheck, KeyRound } from 'lucide-react';
import { Button, Input, Card, Badge } from '../../components/ui';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  addToast: (msg: string, type: 'success' | 'warning' | 'error' | 'info') => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, addToast }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);

    // Simulate authentication processing
    setTimeout(() => {
      /*
        FUTURE SUPABASE INTEGRATION SCHEMA:
        ==================================
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password,
        });
        if (error) {
          setError(error.message);
          return;
        }
        onLoginSuccess();
      */
      if (email.trim().toLowerCase() === 'admin@restaurant.com' && password === '123456') {
        addToast('Authentication successful. Welcome, administrator.', 'success');
        onLoginSuccess();
      } else {
        setError('Access denied. Invalid administrator credentials.');
        addToast('Authentication failed', 'error');
      }
      setLoading(false);
    }, 1200);
  };

  const handleQuickDemoFill = () => {
    setEmail('admin@restaurant.com');
    setPassword('123456');
    setError('');
    addToast('Demo credentials populated', 'info');
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 text-left">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="max-w-md w-full"
      >
        <Card variant="standard" className="border border-white/10 bg-slate-900/60 backdrop-blur-xl p-8 relative shadow-2xl rounded-[2rem] overflow-hidden">
          {/* Subtle Decorative Background Light */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Return to website */}
          <div className="mb-6 relative z-10">
            <button
              onClick={() => navigate('/')}
              className="text-[10px] font-mono font-black text-amber-400 hover:text-amber-300 transition-all flex items-center gap-1.5 cursor-pointer bg-white/5 hover:bg-amber-500/10 border border-white/10 hover:border-amber-500/30 rounded-full px-3 py-1.5 uppercase tracking-wider"
            >
              ← Back to Restaurant Website
            </button>
          </div>

          <div className="text-center space-y-3 relative z-10">
            {/* Elegant shield indicator */}
            <div className="mx-auto w-12 h-12 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            
            <div className="space-y-1">
              <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase font-mono">
                SECURE CONSOLE ENTRY
              </span>
              <h2 className="text-2xl font-black font-display text-white uppercase tracking-tight">
                L'ÉTOILE ADMIN
              </h2>
            </div>
            
            <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
              Authorized personnel only. Enter system administrator credentials to access the merchant management backend.
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-8 space-y-5 relative z-10">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-[11px] font-mono text-rose-400"
              >
                ⚠ {error}
              </motion.div>
            )}

            <div className="space-y-4">
              <Input
                label="ADMIN EMAIL"
                type="email"
                placeholder="admin@restaurant.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail className="w-4 h-4 text-slate-500" />}
                required
                disabled={loading}
              />

              <Input
                label="PASSWORD"
                type="password"
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock className="w-4 h-4 text-slate-500" />}
                required
                disabled={loading}
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="amber"
                className="w-full text-xs font-black py-3 uppercase tracking-wider flex items-center justify-center gap-2"
                loading={loading}
              >
                Authenticate Entry <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </form>

          {/* Quick Demo Assist Block */}
          <div className="mt-6 pt-6 border-t border-white/5 text-center relative z-10">
            <span className="text-[10px] text-slate-500 block mb-3 font-mono font-bold tracking-wider uppercase">
              Developer & Sandbox Testing
            </span>
            <button
              onClick={handleQuickDemoFill}
              className="group w-full py-2.5 px-4 bg-white/5 border border-white/10 hover:border-amber-500/40 hover:bg-amber-500/[0.04] text-slate-300 hover:text-white rounded-2xl text-xs font-semibold flex items-center justify-between transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center gap-2 text-left">
                <KeyRound className="w-4 h-4 text-amber-500 group-hover:rotate-12 transition-transform" />
                <div>
                  <span className="block text-[11px] font-bold">Use Demo Account</span>
                  <span className="block text-[9px] text-slate-500 font-mono">admin@restaurant.com / 123456</span>
                </div>
              </div>
              <Badge variant="primary" className="text-[9px] font-mono">Quick Fill</Badge>
            </button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};
