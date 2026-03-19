import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, User, Bell, Palette, Shield, Save, Moon, Sun, Globe, Mail, Lock } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.1 } })
};

export default function SettingsPage() {
  const { isDark, toggleTheme } = useTheme();
  const [activeSection, setActiveSection] = useState('profile');
  const [notifications, setNotifications] = useState({
    email: true,
    overdue: true,
    newBooks: false,
    reports: true,
  });

  const sections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-surface-900 dark:text-white flex items-center gap-2">
          <SettingsIcon className="w-7 h-7 text-primary-500" />
          Settings
        </h2>
        <p className="text-sm text-surface-500 mt-1">Manage your account preferences</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Settings Nav */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="glass-card !p-3 lg:col-span-1">
          <nav className="space-y-1">
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full ${activeSection === section.id ? 'sidebar-link-active' : 'sidebar-link'}`}
              >
                <section.icon className="w-5 h-5" />
                <span className="text-sm">{section.label}</span>
              </button>
            ))}
          </nav>
        </motion.div>

        {/* Settings Content */}
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card lg:col-span-3"
        >
          {activeSection === 'profile' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-surface-900 dark:text-white">Profile Settings</h3>
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-400 to-violet-500 flex items-center justify-center text-white font-bold text-2xl">
                  AJ
                </div>
                <div>
                  <button className="btn-secondary text-sm">Change Avatar</button>
                  <p className="text-xs text-surface-500 mt-1">JPG, PNG or GIF. Max 2MB.</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Full Name</label>
                  <input type="text" defaultValue="Alice Johnson" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Email</label>
                  <input type="email" defaultValue="alice@example.com" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Role</label>
                  <input type="text" value="Admin" disabled className="input-field bg-surface-50 dark:bg-surface-700" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Member Since</label>
                  <input type="text" value="January 15, 2024" disabled className="input-field bg-surface-50 dark:bg-surface-700" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Bio</label>
                <textarea rows={3} className="input-field resize-none" defaultValue="Library administrator with a passion for organizing knowledge and promoting reading culture." />
              </div>
              <button className="btn-primary flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-surface-900 dark:text-white">Notification Preferences</h3>
              <div className="space-y-4">
                {[
                  { key: 'email', label: 'Email Notifications', desc: 'Receive email updates about library activity' },
                  { key: 'overdue', label: 'Overdue Alerts', desc: 'Get notified when books are overdue' },
                  { key: 'newBooks', label: 'New Book Alerts', desc: 'Notifications when new books are added' },
                  { key: 'reports', label: 'Weekly Reports', desc: 'Receive weekly analytics reports' },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between p-4 rounded-xl bg-surface-50 dark:bg-surface-700/50">
                    <div>
                      <p className="text-sm font-medium text-surface-900 dark:text-white">{item.label}</p>
                      <p className="text-xs text-surface-500">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key] })}
                      className={`w-12 h-7 rounded-full transition-colors relative ${
                        notifications[item.key] ? 'bg-primary-500' : 'bg-surface-300 dark:bg-surface-600'
                      }`}
                    >
                      <motion.div
                        animate={{ x: notifications[item.key] ? 22 : 2 }}
                        className="w-5 h-5 bg-white rounded-full shadow-sm absolute top-1"
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'appearance' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-surface-900 dark:text-white">Appearance</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-surface-50 dark:bg-surface-700/50">
                  <div className="flex items-center gap-3">
                    {isDark ? <Moon className="w-5 h-5 text-primary-500" /> : <Sun className="w-5 h-5 text-amber-500" />}
                    <div>
                      <p className="text-sm font-medium text-surface-900 dark:text-white">Dark Mode</p>
                      <p className="text-xs text-surface-500">Toggle between light and dark themes</p>
                    </div>
                  </div>
                  <button
                    onClick={toggleTheme}
                    className={`w-12 h-7 rounded-full transition-colors relative ${
                      isDark ? 'bg-primary-500' : 'bg-surface-300'
                    }`}
                  >
                    <motion.div
                      animate={{ x: isDark ? 22 : 2 }}
                      className="w-5 h-5 bg-white rounded-full shadow-sm absolute top-1"
                    />
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-surface-50 dark:bg-surface-700/50">
                  <div className="flex items-center gap-3 mb-3">
                    <Globe className="w-5 h-5 text-primary-500" />
                    <div>
                      <p className="text-sm font-medium text-surface-900 dark:text-white">Language</p>
                      <p className="text-xs text-surface-500">Select your preferred language</p>
                    </div>
                  </div>
                  <select className="input-field">
                    <option>English (US)</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                    <option>Japanese</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'security' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-surface-900 dark:text-white">Security</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                    <Lock className="w-4 h-4 inline mr-1" />
                    Current Password
                  </label>
                  <input type="password" placeholder="Enter current password" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">New Password</label>
                  <input type="password" placeholder="Enter new password" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Confirm New Password</label>
                  <input type="password" placeholder="Confirm new password" className="input-field" />
                </div>
                <button className="btn-primary flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Update Password
                </button>
              </div>

              <div className="pt-6 border-t border-surface-200 dark:border-surface-700">
                <h4 className="text-sm font-semibold text-surface-900 dark:text-white mb-3">Two-Factor Authentication</h4>
                <div className="flex items-center justify-between p-4 rounded-xl bg-surface-50 dark:bg-surface-700/50">
                  <div>
                    <p className="text-sm font-medium text-surface-900 dark:text-white">2FA Status</p>
                    <p className="text-xs text-surface-500">Add an extra layer of security</p>
                  </div>
                  <button className="btn-secondary text-sm">Enable</button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
