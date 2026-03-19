import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Edit, Trash2, Eye, Filter, Grid, List, BookOpen, X } from 'lucide-react';
import { books } from '../../data/mockData';

export default function BooksPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('table');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  const categories = ['All', 'Fiction', 'Technology', 'Non-Fiction', 'Classic', 'Science'];

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.isbn.includes(searchQuery);
    const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available': return 'badge-success';
      case 'Unavailable': return 'badge-danger';
      case 'Low Stock': return 'badge-warning';
      default: return 'badge-info';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-surface-900 dark:text-white">Book Management</h2>
          <p className="text-sm text-surface-500 mt-1">{filteredBooks.length} books in your library</p>
        </div>
        <button onClick={() => { setSelectedBook(null); setShowModal(true); }} className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" />
          Add Book
        </button>
      </div>

      {/* Filters Bar */}
      <div className="glass-card !p-4">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex items-center gap-2 bg-surface-50 dark:bg-surface-700 rounded-xl px-4 py-2.5 border border-surface-200 dark:border-surface-600 flex-1 w-full md:w-auto focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/20 transition-all">
            <Search className="w-4 h-4 text-surface-400" />
            <input
              type="text"
              placeholder="Search by title, author, or ISBN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm text-surface-900 dark:text-surface-100 placeholder-surface-400 w-full"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            <Filter className="w-4 h-4 text-surface-400 flex-shrink-0" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                    : 'text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-700'
                }`}
              >{cat}</button>
            ))}
          </div>
          <div className="flex gap-1 ml-auto">
            <button onClick={() => setViewMode('table')} className={`p-2 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600' : 'text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700'}`}>
              <List className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600' : 'text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700'}`}>
              <Grid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Table View */}
      {viewMode === 'table' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card !p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-200 dark:border-surface-700">
                  {['ISBN', 'Title', 'Author', 'Category', 'Copies', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-surface-500 uppercase tracking-wider px-6 py-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredBooks.map((book, i) => (
                  <motion.tr
                    key={book.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-surface-100 dark:border-surface-700/50 hover:bg-surface-50 dark:hover:bg-surface-700/30 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-surface-500 font-mono">{book.isbn}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={book.cover} alt={book.title} className="w-10 h-14 object-cover rounded-lg shadow-sm" />
                        <span className="text-sm font-medium text-surface-900 dark:text-white">{book.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-surface-600 dark:text-surface-400">{book.author}</td>
                    <td className="px-6 py-4"><span className="badge-info">{book.category}</span></td>
                    <td className="px-6 py-4 text-sm text-surface-600 dark:text-surface-400">{book.copies_available}/{book.copies_total}</td>
                    <td className="px-6 py-4"><span className={getStatusColor(book.status)}>{book.status}</span></td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <button onClick={() => { setSelectedBook(book); setShowModal(true); }} className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors text-surface-400 hover:text-primary-500">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors text-surface-400 hover:text-blue-500">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors text-surface-400 hover:text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {filteredBooks.map((book, i) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => { setSelectedBook(book); setShowModal(true); }}
              className="glass-card-hover !p-3 cursor-pointer"
            >
              <img src={book.cover} alt={book.title} className="w-full h-48 object-cover rounded-xl mb-3 shadow-sm" />
              <h4 className="text-sm font-semibold text-surface-900 dark:text-white line-clamp-2 mb-1">{book.title}</h4>
              <p className="text-xs text-surface-500 mb-2">{book.author}</p>
              <div className="flex items-center justify-between">
                <span className={`text-xs ${getStatusColor(book.status)}`}>{book.status}</span>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-amber-500">★</span>
                  <span className="text-xs text-surface-500">{book.rating}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Book Detail Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setShowModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[600px] md:max-h-[80vh] bg-white dark:bg-surface-800 rounded-2xl shadow-2xl z-50 overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-surface-900 dark:text-white">
                    {selectedBook ? 'Book Details' : 'Add New Book'}
                  </h3>
                  <button onClick={() => setShowModal(false)} className="p-2 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-700">
                    <X className="w-5 h-5 text-surface-500" />
                  </button>
                </div>

                {selectedBook ? (
                  <div className="space-y-4">
                    <div className="flex gap-6">
                      <img src={selectedBook.cover} alt={selectedBook.title} className="w-32 h-48 object-cover rounded-xl shadow-lg" />
                      <div className="flex-1 space-y-3">
                        <h4 className="text-2xl font-bold text-surface-900 dark:text-white">{selectedBook.title}</h4>
                        <p className="text-surface-500">by {selectedBook.author}</p>
                        <span className={getStatusColor(selectedBook.status)}>{selectedBook.status}</span>
                        <div className="grid grid-cols-2 gap-3 mt-4">
                          <div className="bg-surface-50 dark:bg-surface-700 rounded-xl p-3">
                            <p className="text-xs text-surface-500">ISBN</p>
                            <p className="text-sm font-medium text-surface-900 dark:text-white font-mono">{selectedBook.isbn}</p>
                          </div>
                          <div className="bg-surface-50 dark:bg-surface-700 rounded-xl p-3">
                            <p className="text-xs text-surface-500">Category</p>
                            <p className="text-sm font-medium text-surface-900 dark:text-white">{selectedBook.category}</p>
                          </div>
                          <div className="bg-surface-50 dark:bg-surface-700 rounded-xl p-3">
                            <p className="text-xs text-surface-500">Copies</p>
                            <p className="text-sm font-medium text-surface-900 dark:text-white">{selectedBook.copies_available} / {selectedBook.copies_total}</p>
                          </div>
                          <div className="bg-surface-50 dark:bg-surface-700 rounded-xl p-3">
                            <p className="text-xs text-surface-500">Rating</p>
                            <p className="text-sm font-medium text-surface-900 dark:text-white">★ {selectedBook.rating}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <form className="space-y-4">
                    {[
                      { label: 'ISBN', placeholder: '978-0-000-00000-0' },
                      { label: 'Title', placeholder: 'Enter book title' },
                      { label: 'Author', placeholder: 'Enter author name' },
                    ].map((field) => (
                      <div key={field.label}>
                        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">{field.label}</label>
                        <input type="text" placeholder={field.placeholder} className="input-field" />
                      </div>
                    ))}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Category</label>
                        <select className="input-field">
                          {categories.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Copies</label>
                        <input type="number" placeholder="1" className="input-field" />
                      </div>
                    </div>
                    <div className="flex gap-3 pt-4">
                      <button type="button" className="btn-primary flex-1">Save Book</button>
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
