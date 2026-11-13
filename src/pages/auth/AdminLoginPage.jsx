import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../../components/common/Logo';
import { 
  ShieldCheck, 
  Lock, 
  UserCheck, 
  Eye, 
  EyeOff, 
  ArrowLeft 
} from 'lucide-react';

export const AdminLoginPage = () => {
  const { loginAdmin } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    setLoading(true);
    try {
      await loginAdmin(username, password);
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Back Link */}
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public Website</span>
          </Link>
        </div>

        {/* Brand & Heading */}
        <div className="text-center space-y-2">
          <Logo size="lg" invert={true} className="justify-center" />
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold mt-4">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Protected Management Portal</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            SAFAR CYCLE Owner Login
          </h2>
          <p className="text-xs text-stone-400">
            Workshop, Inventory, Sales & Bookings Control
          </p>
        </div>

        {/* Card */}
        <div className="bg-stone-800/90 rounded-3xl p-6 sm:p-8 border border-stone-700 shadow-2xl space-y-5">
          {error && (
            <div className="p-3 bg-rose-950/60 text-rose-300 border border-rose-800 rounded-xl text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-stone-300 block mb-1">
                Admin Username / Identifier
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                  <UserCheck className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-700 bg-stone-900 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-300 block mb-1">
                Secure Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="admin123"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-stone-700 bg-stone-900 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-500 hover:text-stone-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm shadow-lg transition-colors flex items-center justify-center gap-2 mt-4"
            >
              {loading && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
              <ShieldCheck className="w-4 h-4" />
              <span>Enter Admin Dashboard</span>
            </button>
          </form>

          {/* Demo hint */}
          <div className="pt-2 border-t border-stone-700/60 text-center">
            <p className="text-[11px] text-stone-400">
              Demo Credentials: Username <b className="text-stone-200">admin</b>, Password <b className="text-stone-200">admin123</b>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
