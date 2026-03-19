import { motion } from 'framer-motion';
import { TrendingUp, AlertTriangle, DollarSign, Clock, ShieldAlert, ShieldCheck, Shield, BarChart3 } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import { predictions, availabilityPredictions } from '../../data/mockData';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.1 } })
};

const tooltipStyle = {
  contentStyle: { background: 'rgba(255,255,255,0.95)', border: 'none', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' },
};

export default function PredictionsPage() {
  const riskColors = {
    High: { bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-200 dark:border-red-800', text: 'text-red-600 dark:text-red-400', icon: ShieldAlert },
    Medium: { bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-200 dark:border-amber-800', text: 'text-amber-600 dark:text-amber-400', icon: Shield },
    Low: { bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-200 dark:border-emerald-800', text: 'text-emerald-600 dark:text-emerald-400', icon: ShieldCheck },
  };

  const fineHistory = [
    { month: 'Jul', fines: 12.5 },
    { month: 'Aug', fines: 18.0 },
    { month: 'Sep', fines: 15.5 },
    { month: 'Oct', fines: 22.0 },
    { month: 'Nov', fines: 19.5 },
    { month: 'Dec', fines: 25.0 },
  ];

  const demandData = [
    { day: 'Mon', demand: 15, capacity: 20 },
    { day: 'Tue', demand: 18, capacity: 20 },
    { day: 'Wed', demand: 22, capacity: 20 },
    { day: 'Thu', demand: 19, capacity: 20 },
    { day: 'Fri', demand: 25, capacity: 20 },
    { day: 'Sat', demand: 30, capacity: 20 },
    { day: 'Sun', demand: 12, capacity: 20 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-surface-900 dark:text-white flex items-center gap-2">
          <TrendingUp className="w-7 h-7 text-primary-500" />
          Smart Predictions
        </h2>
        <p className="text-sm text-surface-500 mt-1">AI-powered fine predictions and availability forecasting</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'High Risk Members', value: predictions.filter(p => p.riskLevel === 'High').length, icon: AlertTriangle, color: 'from-red-500 to-red-600' },
          { label: 'Estimated Fines', value: `$${predictions.reduce((s, p) => s + p.estimatedFine, 0).toFixed(2)}`, icon: DollarSign, color: 'from-amber-500 to-amber-600' },
          { label: 'Books in Demand', value: availabilityPredictions.length, icon: Clock, color: 'from-primary-500 to-primary-600' },
        ].map((stat, i) => (
          <motion.div key={i} initial="hidden" animate="visible" variants={fadeUp} custom={i} className="glass-card flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-surface-500">{stat.label}</p>
              <p className="text-2xl font-bold text-surface-900 dark:text-white">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Late Return Risk Cards */}
      <div>
        <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">Late Return Risk Assessment</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {predictions.map((pred, i) => {
            const risk = riskColors[pred.riskLevel];
            return (
              <motion.div
                key={pred.id}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                custom={i}
                className={`rounded-2xl p-5 border ${risk.bg} ${risk.border} transition-all hover:shadow-lg`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-violet-500 flex items-center justify-center text-white font-semibold text-sm">
                      {pred.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-surface-900 dark:text-white">{pred.memberName}</p>
                      <p className="text-xs text-surface-500">{pred.bookTitle}</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 ${risk.text}`}>
                    <risk.icon className="w-4 h-4" />
                    <span className="text-xs font-bold">{pred.riskLevel}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-surface-500">Late probability</span>
                    <span className="font-bold text-surface-900 dark:text-white">{pred.probability}%</span>
                  </div>
                  <div className="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pred.probability}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className={`h-2 rounded-full ${
                        pred.riskLevel === 'High' ? 'bg-red-500' :
                        pred.riskLevel === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-surface-500">Estimated fine</span>
                    <span className="font-bold text-surface-900 dark:text-white">${pred.estimatedFine.toFixed(2)}</span>
                  </div>
                  {pred.daysOverdue > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-surface-500">Days overdue</span>
                      <span className={`font-bold ${risk.text}`}>{pred.daysOverdue} days</span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Fine History */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={6} className="glass-card">
          <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-1">Fine History</h3>
          <p className="text-sm text-surface-500 mb-4">Monthly fine collection trends</p>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={fineHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" strokeOpacity={0.5} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#737373' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#737373' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
              <Tooltip {...tooltipStyle} formatter={(v) => [`$${v}`, 'Fines']} />
              <Bar dataKey="fines" fill="#F59E0B" radius={[8, 8, 0, 0]} barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Demand Forecast */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={7} className="glass-card">
          <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-1">Demand Forecast</h3>
          <p className="text-sm text-surface-500 mb-4">Predicted demand vs capacity</p>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={demandData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" strokeOpacity={0.5} />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#737373' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#737373' }} axisLine={false} tickLine={false} />
              <Tooltip {...tooltipStyle} />
              <Line type="monotone" dataKey="demand" stroke="#6366F1" strokeWidth={2.5} dot={{ fill: '#6366F1', r: 4 }} name="Demand" />
              <Line type="monotone" dataKey="capacity" stroke="#EF4444" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Capacity" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Book Availability Predictions */}
      <div>
        <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">Book Availability Predictions</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {availabilityPredictions.map((pred, i) => (
            <motion.div key={pred.id} initial="hidden" animate="visible" variants={fadeUp} custom={i} className="glass-card-hover">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-sm font-semibold text-surface-900 dark:text-white">{pred.bookTitle}</h4>
                  <p className="text-xs text-surface-500">Currently with: {pred.currentBorrower}</p>
                </div>
                <span className={`badge ${pred.demand === 'High' ? 'badge-danger' : pred.demand === 'Medium' ? 'badge-warning' : 'badge-success'}`}>
                  {pred.demand} Demand
                </span>
              </div>
              <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-4 mb-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary-500" />
                  <p className="text-sm font-medium text-primary-700 dark:text-primary-300">
                    Book will likely be available in <span className="font-bold">{pred.estimatedReturn}</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-surface-500">Waitlisted: {pred.waitlist} members</span>
                <span className="text-surface-500">Confidence: <span className="font-bold text-surface-900 dark:text-white">{pred.confidence}%</span></span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
