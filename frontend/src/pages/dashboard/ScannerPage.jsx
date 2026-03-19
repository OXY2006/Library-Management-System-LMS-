import { useState } from 'react';
import { motion } from 'framer-motion';
import { ScanLine, Camera, BookOpen, User, Check, X, History, QrCode } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.1 } })
};

export default function ScannerPage() {
  const [scanning, setScanning] = useState(false);
  const [scannedResult, setScannedResult] = useState(null);

  const mockScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setScannedResult({
        type: 'book',
        isbn: '978-0-13-235088-4',
        title: 'Clean Code',
        author: 'Robert C. Martin',
        category: 'Technology',
        status: 'Available',
        cover: 'https://images.unsplash.com/photo-1550399105-c4db5fb85c18?w=200&h=300&fit=crop',
      });
    }, 2000);
  };

  const scanHistory = [
    { id: 1, type: 'Issue', book: 'Clean Code', member: 'Bob Smith', time: '10:30 AM', status: 'Success' },
    { id: 2, type: 'Return', book: 'Sapiens', member: 'Alice Johnson', time: '10:15 AM', status: 'Success' },
    { id: 3, type: 'Issue', book: '1984', member: 'David Wilson', time: '09:45 AM', status: 'Success' },
    { id: 4, type: 'Issue', book: 'Design Patterns', member: 'Henry Kim', time: '09:20 AM', status: 'Failed' },
    { id: 5, type: 'Return', book: 'The Great Gatsby', member: 'Frank Brown', time: '09:00 AM', status: 'Success' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-surface-900 dark:text-white flex items-center gap-2">
          <ScanLine className="w-7 h-7 text-primary-500" />
          QR Code / Barcode Scanner
        </h2>
        <p className="text-sm text-surface-500 mt-1">Instant book issue and return with scanning</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Scanner Interface */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="glass-card">
          <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4 flex items-center gap-2">
            <Camera className="w-5 h-5 text-primary-500" />
            Scan Book or Member ID
          </h3>

          {/* Scanner Preview */}
          <div className="relative bg-surface-900 rounded-2xl overflow-hidden aspect-video mb-4 flex items-center justify-center">
            <div className="absolute inset-4 border-2 border-dashed border-primary-400/50 rounded-xl" />

            {scanning && (
              <motion.div
                className="absolute left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-primary-500 to-transparent"
                animate={{ top: ['10%', '90%', '10%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              />
            )}

            {!scanning && !scannedResult && (
              <div className="text-center">
                <QrCode className="w-16 h-16 text-surface-600 mx-auto mb-3" />
                <p className="text-surface-400 text-sm">Position QR code or barcode in frame</p>
              </div>
            )}

            {scanning && (
              <div className="text-center">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <ScanLine className="w-16 h-16 text-primary-400 mx-auto mb-3" />
                </motion.div>
                <p className="text-primary-400 text-sm animate-pulse">Scanning...</p>
              </div>
            )}

            {scannedResult && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center mx-auto mb-3">
                  <Check className="w-8 h-8 text-white" />
                </div>
                <p className="text-emerald-400 text-sm font-medium">Book Detected!</p>
              </motion.div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={mockScan}
              disabled={scanning}
              className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Camera className="w-4 h-4" />
              {scanning ? 'Scanning...' : 'Start Scan'}
            </button>
            <button
              onClick={() => setScannedResult(null)}
              className="btn-secondary flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              Reset
            </button>
          </div>

          {/* Manual Input */}
          <div className="mt-4 pt-4 border-t border-surface-200 dark:border-surface-700">
            <p className="text-sm text-surface-500 mb-2">Or enter manually:</p>
            <div className="flex gap-2">
              <input type="text" placeholder="Enter ISBN or Member ID..." className="input-field flex-1" />
              <button className="btn-primary !px-4">Look Up</button>
            </div>
          </div>
        </motion.div>

        {/* Scanned Result / Book Preview */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={1} className="space-y-4">
          {scannedResult ? (
            <div className="glass-card">
              <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary-500" />
                Book Details
              </h3>
              <div className="flex gap-5">
                <img src={scannedResult.cover} alt={scannedResult.title} className="w-28 h-40 object-cover rounded-xl shadow-lg" />
                <div className="flex-1 space-y-3">
                  <h4 className="text-xl font-bold text-surface-900 dark:text-white">{scannedResult.title}</h4>
                  <p className="text-surface-500">by {scannedResult.author}</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-surface-50 dark:bg-surface-700 rounded-lg p-2">
                      <p className="text-xs text-surface-500">ISBN</p>
                      <p className="text-sm font-mono font-medium text-surface-900 dark:text-white">{scannedResult.isbn}</p>
                    </div>
                    <div className="bg-surface-50 dark:bg-surface-700 rounded-lg p-2">
                      <p className="text-xs text-surface-500">Category</p>
                      <p className="text-sm font-medium text-surface-900 dark:text-white">{scannedResult.category}</p>
                    </div>
                  </div>
                  <span className="badge-success">{scannedResult.status}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-surface-200 dark:border-surface-700">
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  <User className="w-4 h-4 inline mr-1" />
                  Scan or Select Member
                </label>
                <input type="text" placeholder="Scan member ID or enter name..." className="input-field mb-3" />
                <div className="flex gap-3">
                  <button className="btn-primary flex-1">Issue Book</button>
                  <button className="btn-secondary flex-1">Return Book</button>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-card flex items-center justify-center min-h-[300px]">
              <div className="text-center">
                <QrCode className="w-20 h-20 text-surface-300 dark:text-surface-600 mx-auto mb-4" />
                <p className="text-surface-500 text-lg font-medium">No book scanned yet</p>
                <p className="text-surface-400 text-sm mt-1">Use the scanner to detect a book</p>
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Today\'s Scans', value: '47' },
              { label: 'Issues', value: '28' },
              { label: 'Returns', value: '19' },
            ].map((stat, i) => (
              <div key={i} className="glass-card text-center !py-4">
                <p className="text-2xl font-bold text-surface-900 dark:text-white">{stat.value}</p>
                <p className="text-xs text-surface-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Scan History */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={2} className="glass-card !p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-surface-200 dark:border-surface-700 flex items-center gap-2">
          <History className="w-5 h-5 text-surface-500" />
          <h3 className="text-lg font-semibold text-surface-900 dark:text-white">Scan History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-200 dark:border-surface-700">
                {['Type', 'Book', 'Member', 'Time', 'Status'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-surface-500 uppercase tracking-wider px-6 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {scanHistory.map((scan) => (
                <tr key={scan.id} className="border-b border-surface-100 dark:border-surface-700/50 hover:bg-surface-50 dark:hover:bg-surface-700/30 transition-colors">
                  <td className="px-6 py-3">
                    <span className={scan.type === 'Issue' ? 'badge-info' : 'badge-success'}>
                      {scan.type}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm font-medium text-surface-900 dark:text-white">{scan.book}</td>
                  <td className="px-6 py-3 text-sm text-surface-600 dark:text-surface-400">{scan.member}</td>
                  <td className="px-6 py-3 text-sm text-surface-500">{scan.time}</td>
                  <td className="px-6 py-3">
                    <span className={scan.status === 'Success' ? 'badge-success' : 'badge-danger'}>
                      {scan.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
