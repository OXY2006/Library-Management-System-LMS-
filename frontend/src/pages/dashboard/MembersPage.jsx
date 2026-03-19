import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, UserPlus, Eye, Edit, Trash2, X, Mail, Calendar, Shield } from 'lucide-react';
import { members } from '../../data/mockData';

export default function MembersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [filterType, setFilterType] = useState('All');

  const filtered = members.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'All' || m.type === filterType;
    return matchesSearch && matchesType;
  });

  const getTypeBadge = (type) => {
    switch (type) {
      case 'Admin': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400';
      case 'Librarian': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
      default: return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-surface-900 dark:text-white">Member Management</h2>
          <p className="text-sm text-surface-500 mt-1">{filtered.length} registered members</p>
        </div>
        <button onClick={() => { setSelectedMember(null); setShowModal(true); }} className="btn-primary flex items-center gap-2 text-sm">
          <UserPlus className="w-4 h-4" />
          Add Member
        </button>
      </div>

      <div className="glass-card !p-4 flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="flex items-center gap-2 bg-surface-50 dark:bg-surface-700 rounded-xl px-4 py-2.5 border border-surface-200 dark:border-surface-600 flex-1 w-full md:w-auto focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/20 transition-all">
          <Search className="w-4 h-4 text-surface-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-sm text-surface-900 dark:text-surface-100 placeholder-surface-400 w-full"
          />
        </div>
        <div className="flex gap-2">
          {['All', 'Admin', 'Librarian', 'Member'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filterType === type
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                  : 'text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-700'
              }`}
            >{type}</button>
          ))}
        </div>
      </div>

      {/* Members Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((member, i) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card-hover cursor-pointer"
            onClick={() => { setSelectedMember(member); setShowModal(true); }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-400 to-violet-500 flex items-center justify-center text-white font-bold text-lg">
                  {member.avatar}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-surface-900 dark:text-white">{member.name}</h4>
                  <p className="text-xs text-surface-500">{member.email}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className={`badge ${getTypeBadge(member.type)}`}>
                <Shield className="w-3 h-3 mr-1" />
                {member.type}
              </span>
              <span className={member.status === 'Active' ? 'badge-success' : 'badge-danger'}>{member.status}</span>
            </div>
            <div className="mt-4 pt-4 border-t border-surface-100 dark:border-surface-700 grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-surface-500">Books Borrowed</p>
                <p className="text-lg font-bold text-surface-900 dark:text-white">{member.booksBorrowed}</p>
              </div>
              <div>
                <p className="text-xs text-surface-500">Valid Until</p>
                <p className="text-sm font-medium text-surface-700 dark:text-surface-300">{member.validUntil}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowModal(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[500px] bg-white dark:bg-surface-800 rounded-2xl shadow-2xl z-50 overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-surface-900 dark:text-white">
                    {selectedMember ? 'Member Details' : 'Register New Member'}
                  </h3>
                  <button onClick={() => setShowModal(false)} className="p-2 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-700">
                    <X className="w-5 h-5 text-surface-500" />
                  </button>
                </div>

                {selectedMember ? (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-400 to-violet-500 flex items-center justify-center text-white font-bold text-2xl">
                        {selectedMember.avatar}
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-surface-900 dark:text-white">{selectedMember.name}</h4>
                        <div className="flex items-center gap-2 text-sm text-surface-500">
                          <Mail className="w-4 h-4" />
                          {selectedMember.email}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: 'Role', value: selectedMember.type },
                        { label: 'Status', value: selectedMember.status },
                        { label: 'Joined', value: selectedMember.joinDate },
                        { label: 'Valid Until', value: selectedMember.validUntil },
                        { label: 'Books Borrowed', value: selectedMember.booksBorrowed },
                      ].map((item, i) => (
                        <div key={i} className="bg-surface-50 dark:bg-surface-700 rounded-xl p-3">
                          <p className="text-xs text-surface-500">{item.label}</p>
                          <p className="text-sm font-medium text-surface-900 dark:text-white">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <form className="space-y-4">
                    {[
                      { label: 'Full Name', placeholder: 'John Doe', type: 'text' },
                      { label: 'Email', placeholder: 'john@example.com', type: 'email' },
                    ].map((field) => (
                      <div key={field.label}>
                        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">{field.label}</label>
                        <input type={field.type} placeholder={field.placeholder} className="input-field" />
                      </div>
                    ))}
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Membership Type</label>
                      <select className="input-field">
                        <option>Member</option>
                        <option>Librarian</option>
                        <option>Admin</option>
                      </select>
                    </div>
                    <div className="flex gap-3 pt-4">
                      <button type="button" className="btn-primary flex-1">Register Member</button>
                      <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
