import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookMarked, Mail, Lock, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call for now (since we haven't connected frontend to backend yet)
    // We will let the user use the dashboard directly after "logging in"
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-400/20 rounded-full blur-[120px] mix-blend-multiply opacity-50 dark:opacity-20 translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-400/20 rounded-full blur-[120px] mix-blend-multiply opacity-50 dark:opacity-20 -translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sm:mx-auto sm:w-full sm:max-w-md z-10"
      >
        <Link to="/" className="flex justify-center items-center gap-2 mb-6 group">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-primary-500/30 group-hover:scale-105 transition-transform duration-300">
            <BookMarked className="w-7 h-7" />
          </div>
          <span className="text-3xl font-extrabold tracking-tight text-surface-900 dark:text-white">
            Library<span className="text-primary-600 dark:text-primary-400">AI</span>
          </span>
        </Link>
        <h2 className="text-center text-3xl font-extrabold text-surface-900 dark:text-white">
          Welcome back
        </h2>
        <p className="mt-2 text-center text-sm text-surface-600 dark:text-surface-400">
          Sign in to access your intelligent dashboard
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10"
      >
        <div className="glass-card !p-8 shadow-xl shadow-surface-200/50 dark:shadow-black/20">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-surface-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field !pl-10"
                  placeholder="alice@libraryai.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-surface-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field !pl-10"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-surface-300 rounded cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-surface-700 dark:text-surface-300 cursor-pointer">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
                  Forgot password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex justify-center py-3 text-base shadow-lg shadow-primary-500/30"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  Sign in to Dashboard
                  <ArrowRight className="w-5 h-5" />
                </span>
              )}
            </button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-surface-200 dark:border-surface-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-surface-800 text-surface-500 font-medium rounded-full">
                  Test Credentials
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 text-xs text-center">
              <div className="bg-surface-50 dark:bg-surface-700/50 p-2 rounded-lg border border-surface-100 dark:border-surface-600">
                <p className="font-bold text-surface-900 dark:text-white">Admin</p>
                <p className="text-surface-500">alice@libraryai.com</p>
              </div>
              <div className="bg-surface-50 dark:bg-surface-700/50 p-2 rounded-lg border border-surface-100 dark:border-surface-600">
                <p className="font-bold text-surface-900 dark:text-white">Member</p>
                <p className="text-surface-500">bob@example.com</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
