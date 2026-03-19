import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftRight, BookOpen, User, CalendarDays, DollarSign, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { transactions, books, members } from '../../data/mockData';

export default function IssueReturnPage() {
  const [activeTab, setActiveTab] = useState('issue');

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Issued': return 'badge-info';
      case 'Returned': return 'badge-success';
      case 'Returned Late': return 'badge-warning';
      case 'Overdue': return 'badge-danger';
      default: return 'badge-info';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Issued': return <Clock className="w-4 h-4" />;
      case 'Returned': return <CheckCircle2 className="w-4 h-4" />;
      case 'Returned Late': return <AlertTriangle className="w-4 h-4" />;
      case 'Overdue': return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-surface-900 dark:text-white">Issue & Return</h2>
        <p className="text-sm text-surface-500 mt-1">Manage book transactions</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {['issue', 'return'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 rounded-xl font-medium capitalize transition-all ${
              activeTab === tab
                ? 'gradient-bg text-white shadow-lg shadow-primary-500/30'
                : 'bg-white dark:bg-surface-800 text-surface-600 dark:text-surface-400 border border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-700'
            }`}
          >
            {tab === 'issue' ? 'Issue Book' : 'Return Book'}
          </button>
        ))}
      </div>

      {/* Form */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card"
      >
        <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-6 flex items-center gap-2">
          <ArrowLeftRight className="w-5 h-5 text-primary-500" />
          {activeTab === 'issue' ? 'Issue a Book' : 'Return a Book'}
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
              <BookOpen className="w-4 h-4 inline mr-1" />
              Select Book
            </label>
            <select className="input-field">
              <option value="">Choose a book...</option>
              {books.filter(b => activeTab === 'issue' ? b.copies_available > 0 : true).map(b => (
                <option key={b.id} value={b.id}>{b.title} — {b.author}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
              <User className="w-4 h-4 inline mr-1" />
              Select Member
            </label>
            <select className="input-field">
              <option value="">Choose a member...</option>
              {members.filter(m => m.status === 'Active').map(m => (
                <option key={m.id} value={m.id}>{m.name} — {m.type}</option>
              ))}
            </select>
          </div>
          {activeTab === 'issue' && (
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                <CalendarDays className="w-4 h-4 inline mr-1" />
                Due Date
              </label>
              <input type="date" className="input-field" />
            </div>
          )}
          {activeTab === 'return' && (
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                <DollarSign className="w-4 h-4 inline mr-1" />
                Fine Amount
              </label>
              <input type="text" value="Auto-calculated" disabled className="input-field bg-surface-50 dark:bg-surface-700" />
            </div>
          )}
        </div>
        <div className="mt-6 flex gap-3">
          <button className="btn-primary">
            {activeTab === 'issue' ? 'Issue Book' : 'Process Return'}
          </button>
          <button className="btn-secondary">Reset</button>
        </div>
      </motion.div>

      {/* Transactions Table */}
      <div className="glass-card !p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-surface-200 dark:border-surface-700">
          <h3 className="text-lg font-semibold text-surface-900 dark:text-white">Transaction History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-200 dark:border-surface-700">
                {['Book', 'Member', 'Issue Date', 'Due Date', 'Return Date', 'Status', 'Fine'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-surface-500 uppercase tracking-wider px-6 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transactions.map((t, i) => (
                <motion.tr
                  key={t.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-surface-100 dark:border-surface-700/50 hover:bg-surface-50 dark:hover:bg-surface-700/30 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium text-surface-900 dark:text-white">{t.bookTitle}</td>
                  <td className="px-6 py-4 text-sm text-surface-600 dark:text-surface-400">{t.memberName}</td>
                  <td className="px-6 py-4 text-sm text-surface-500">{t.issueDate}</td>
                  <td className="px-6 py-4 text-sm text-surface-500">{t.dueDate}</td>
                  <td className="px-6 py-4 text-sm text-surface-500">{t.returnDate || '—'}</td>
                  <td className="px-6 py-4">
                    <span className={`${getStatusStyle(t.status)} flex items-center gap-1 w-fit`}>
                      {getStatusIcon(t.status)}
                      {t.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-surface-900 dark:text-white">
                    {t.fine > 0 ? `$${t.fine.toFixed(2)}` : '—'}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
