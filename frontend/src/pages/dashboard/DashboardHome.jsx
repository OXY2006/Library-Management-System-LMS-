import { motion } from 'framer-motion';
import {
  BookOpen, Users, ArrowLeftRight, AlertTriangle, TrendingUp,
  TrendingDown, Brain, Clock, Activity
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { analyticsData, books, members, transactions, predictions } from '../../data/mockData';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.1 } })
};

export default function DashboardHome() {
  const stats = [
    { label: 'Total Books', value: '12,847', trend: '+12%', up: true, icon: BookOpen, color: 'from-primary-500 to-primary-600', bg: 'bg-primary-50 dark:bg-primary-900/20' },
    { label: 'Active Members', value: '3,456', trend: '+8.2%', up: true, icon: Users, color: 'from-emerald-500 to-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
    { label: 'Books Issued', value: '892', trend: '+15.3%', up: true, icon: ArrowLeftRight, color: 'from-violet-500 to-violet-600', bg: 'bg-violet-50 dark:bg-violet-900/20' },
    { label: 'Overdue Returns', value: '23', trend: '-5.1%', up: false, icon: AlertTriangle, color: 'from-amber-500 to-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
  ];

  const recentActivity = [
    { action: 'Book Issued', detail: '"Clean Code" to Bob Smith', time: '2 min ago', type: 'issue' },
    { action: 'Book Returned', detail: '"Sapiens" by Alice Johnson', time: '15 min ago', type: 'return' },
    { action: 'New Member', detail: 'Sarah Connor registered', time: '1 hour ago', type: 'member' },
    { action: 'Overdue Alert', detail: '"Design Patterns" — Henry Kim', time: '2 hours ago', type: 'alert' },
    { action: 'Review Added', detail: '5★ review for "1984"', time: '3 hours ago', type: 'review' },
  ];

  const COLORS = analyticsData.genreDistribution.map(g => g.color);

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={i}
            className="glass-card flex items-center gap-4 group hover:shadow-lg hover:shadow-primary-500/5 transition-all duration-300"
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-surface-500 dark:text-surface-400">{stat.label}</p>
              <p className="text-2xl font-bold text-surface-900 dark:text-white">{stat.value}</p>
              <div className={`flex items-center gap-1 text-xs font-medium ${stat.up ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                {stat.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {stat.trend}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Borrowing Trends Chart */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={4} className="lg:col-span-2 glass-card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-surface-900 dark:text-white">Borrowing Trends</h3>
              <p className="text-sm text-surface-500">Monthly overview of library activity</p>
            </div>
            <div className="flex gap-2">
              {['6M', '1Y', 'All'].map((filter) => (
                <button key={filter} className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  filter === '1Y' ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' : 'text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-700'
                }`}>{filter}</button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={analyticsData.monthlyBorrows}>
              <defs>
                <linearGradient id="borrowGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="returnGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" strokeOpacity={0.5} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#737373' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#737373' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: 'rgba(255,255,255,0.95)', border: 'none', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
                itemStyle={{ fontSize: '13px' }}
              />
              <Area type="monotone" dataKey="borrows" stroke="#6366F1" fill="url(#borrowGrad)" strokeWidth={2.5} name="Borrows" />
              <Area type="monotone" dataKey="returns" stroke="#10B981" fill="url(#returnGrad)" strokeWidth={2.5} name="Returns" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Genre Distribution */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={5} className="glass-card">
          <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-1">Genre Distribution</h3>
          <p className="text-sm text-surface-500 mb-4">Popularity by category</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={analyticsData.genreDistribution}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={4}
                dataKey="value"
              >
                {analyticsData.genreDistribution.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: 'rgba(255,255,255,0.95)', border: 'none', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {analyticsData.genreDistribution.map((genre, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: genre.color }} />
                  <span className="text-sm text-surface-600 dark:text-surface-400">{genre.name}</span>
                </div>
                <span className="text-sm font-medium text-surface-900 dark:text-white">{genre.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={6} className="glass-card">
          <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.map((activity, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  activity.type === 'issue' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' :
                  activity.type === 'return' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600' :
                  activity.type === 'member' ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-600' :
                  activity.type === 'alert' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600' :
                  'bg-pink-100 dark:bg-pink-900/30 text-pink-600'
                }`}>
                  {activity.type === 'issue' ? <ArrowLeftRight className="w-5 h-5" /> :
                   activity.type === 'return' ? <ArrowLeftRight className="w-5 h-5" /> :
                   activity.type === 'member' ? <Users className="w-5 h-5" /> :
                   activity.type === 'alert' ? <AlertTriangle className="w-5 h-5" /> :
                   <Activity className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-surface-900 dark:text-white">{activity.action}</p>
                  <p className="text-xs text-surface-500 truncate">{activity.detail}</p>
                </div>
                <span className="text-xs text-surface-400 whitespace-nowrap">{activity.time}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* AI Insights */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={7} className="glass-card">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-5 h-5 text-primary-500" />
            <h3 className="text-lg font-semibold text-surface-900 dark:text-white">AI Insights</h3>
          </div>
          <div className="space-y-3">
            {[
              { title: 'High Demand Alert', desc: '"1984" demand increasing — consider ordering 3 more copies', type: 'warning' },
              { title: 'Late Return Risk', desc: '2 members have >80% probability of late returns this week', type: 'danger' },
              { title: 'Reading Trend', desc: 'Non-fiction popularity up 23% this month compared to last', type: 'info' },
              { title: 'Availability Update', desc: '"Design Patterns" predicted available in 3 days', type: 'success' },
            ].map((insight, i) => (
              <div key={i} className={`p-4 rounded-xl border ${
                insight.type === 'warning' ? 'bg-amber-50/50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800' :
                insight.type === 'danger' ? 'bg-red-50/50 dark:bg-red-900/10 border-red-200 dark:border-red-800' :
                insight.type === 'info' ? 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800' :
                'bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800'
              }`}>
                <p className="text-sm font-medium text-surface-900 dark:text-white mb-0.5">{insight.title}</p>
                <p className="text-xs text-surface-600 dark:text-surface-400">{insight.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
