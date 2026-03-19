import { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, BookOpen, Users, ArrowLeftRight, Brain,
  BarChart3, Star, TrendingUp, ScanLine, Settings, ChevronLeft,
  Search, Bell, Menu, X, Sparkles, LogOut
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { notifications } from '../data/mockData';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { path: '/dashboard/books', icon: BookOpen, label: 'Books' },
  { path: '/dashboard/members', icon: Users, label: 'Members' },
  { path: '/dashboard/issue-return', icon: ArrowLeftRight, label: 'Issue / Return' },
  { path: '/dashboard/recommendations', icon: Brain, label: 'AI Recommendations' },
  { path: '/dashboard/analytics', icon: BarChart3, label: 'Analytics' },
  { path: '/dashboard/reviews', icon: Star, label: 'Reviews' },
  { path: '/dashboard/predictions', icon: TrendingUp, label: 'Predictions' },
  { path: '/dashboard/scanner', icon: ScanLine, label: 'QR Scanner' },
  { path: '/dashboard/settings', icon: Settings, label: 'Settings' },
];

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();

  const pageTitle = navItems.find(item => {
    if (item.end) return location.pathname === item.path;
    return location.pathname.startsWith(item.path);
  })?.label || 'Dashboard';

  return (
    <div className="flex h-screen bg-surface-50 dark:bg-surface-900 overflow-hidden">
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: sidebarOpen ? 280 : 80 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="hidden lg:flex flex-col bg-white dark:bg-surface-800 border-r border-surface-200 dark:border-surface-700 h-full relative z-20"
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-6 border-b border-surface-100 dark:border-surface-700">
          <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <AnimatePresence>
            {sidebarOpen && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="text-xl font-bold font-display text-surface-900 dark:text-white overflow-hidden whitespace-nowrap"
              >
                Library<span className="gradient-text">AI</span>
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) => isActive ? 'sidebar-link-active' : 'sidebar-link'}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="overflow-hidden whitespace-nowrap text-sm"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-white dark:bg-surface-700 border border-surface-200 dark:border-surface-600 flex items-center justify-center shadow-md hover:bg-surface-50 dark:hover:bg-surface-600 transition-colors z-30"
        >
          <ChevronLeft className={`w-3 h-3 text-surface-500 transition-transform duration-300 ${!sidebarOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* User Profile */}
        <div className="border-t border-surface-100 dark:border-surface-700 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-violet-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
              AJ
            </div>
            <AnimatePresence>
              {sidebarOpen && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="overflow-hidden"
                >
                  <p className="text-sm font-semibold text-surface-900 dark:text-white whitespace-nowrap">Alice Johnson</p>
                  <p className="text-xs text-surface-500 whitespace-nowrap">Admin</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-white dark:bg-surface-800 z-50 lg:hidden flex flex-col"
            >
              <div className="flex items-center justify-between px-5 py-6 border-b border-surface-100 dark:border-surface-700">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold font-display text-surface-900 dark:text-white">Library<span className="gradient-text">AI</span></span>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-700">
                  <X className="w-5 h-5 text-surface-500" />
                </button>
              </div>
              <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.end}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) => isActive ? 'sidebar-link-active' : 'sidebar-link'}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="text-sm">{item.label}</span>
                  </NavLink>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white dark:bg-surface-800 border-b border-surface-200 dark:border-surface-700 px-6 py-4 flex items-center justify-between gap-4 z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-700">
              <Menu className="w-5 h-5 text-surface-600 dark:text-surface-400" />
            </button>
            <h1 className="text-xl font-semibold font-display text-surface-900 dark:text-white">{pageTitle}</h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="hidden md:flex items-center gap-2 bg-surface-50 dark:bg-surface-700 rounded-xl px-4 py-2.5 border border-surface-200 dark:border-surface-600 w-64 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/20 transition-all">
              <Search className="w-4 h-4 text-surface-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-sm text-surface-900 dark:text-surface-100 placeholder-surface-400 w-full"
              />
              <kbd className="hidden lg:inline text-xs text-surface-400 bg-surface-200 dark:bg-surface-600 px-1.5 py-0.5 rounded">⌘K</kbd>
            </div>

            {/* Theme Toggle */}
            <button onClick={toggleTheme} className="p-2.5 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors">
              {isDark ? (
                <Sparkles className="w-5 h-5 text-amber-400" />
              ) : (
                <Sparkles className="w-5 h-5 text-surface-500" />
              )}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2.5 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors relative"
              >
                <Bell className="w-5 h-5 text-surface-500 dark:text-surface-400" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-14 w-80 glass-card shadow-xl z-50"
                  >
                    <h3 className="font-semibold text-surface-900 dark:text-white mb-3">Notifications</h3>
                    <div className="space-y-3">
                      {notifications.map((n) => (
                        <div key={n.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors cursor-pointer">
                          <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                            n.type === 'warning' ? 'bg-amber-400' :
                            n.type === 'success' ? 'bg-emerald-400' :
                            n.type === 'danger' ? 'bg-red-400' : 'bg-blue-400'
                          }`} />
                          <div>
                            <p className="text-sm text-surface-700 dark:text-surface-300">{n.message}</p>
                            <p className="text-xs text-surface-400 mt-0.5">{n.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Avatar */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-400 to-violet-500 flex items-center justify-center text-white font-semibold text-sm cursor-pointer hover:shadow-lg hover:shadow-primary-500/30 transition-shadow">
              AJ
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
