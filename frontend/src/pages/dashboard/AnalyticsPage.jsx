import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Calendar, Filter } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import { analyticsData } from '../../data/mockData';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.1 } })
};

const tooltipStyle = {
  contentStyle: { background: 'rgba(255,255,255,0.95)', border: 'none', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' },
};

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('1Y');
  const COLORS = analyticsData.genreDistribution.map(g => g.color);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-surface-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-primary-500" />
            Book Popularity Analytics
          </h2>
          <p className="text-sm text-surface-500 mt-1">Comprehensive insights into library performance</p>
        </div>
        <div className="flex gap-2">
          {['1M', '3M', '6M', '1Y', 'All'].map(range => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                dateRange === range
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                  : 'text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-700'
              }`}
            >{range}</button>
          ))}
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Monthly Borrow Trends */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0} className="glass-card">
          <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-1">Monthly Borrow Trends</h3>
          <p className="text-sm text-surface-500 mb-4">Borrows vs Returns over time</p>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={analyticsData.monthlyBorrows}>
              <defs>
                <linearGradient id="bGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="rGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" strokeOpacity={0.5} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#737373' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#737373' }} axisLine={false} tickLine={false} />
              <Tooltip {...tooltipStyle} />
              <Area type="monotone" dataKey="borrows" stroke="#6366F1" fill="url(#bGrad)" strokeWidth={2.5} name="Borrows" />
              <Area type="monotone" dataKey="returns" stroke="#10B981" fill="url(#rGrad)" strokeWidth={2.5} name="Returns" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Most Borrowed Books */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={1} className="glass-card">
          <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-1">Most Borrowed Books</h3>
          <p className="text-sm text-surface-500 mb-4">Top 5 books by borrow count</p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={analyticsData.topBooks} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" strokeOpacity={0.5} horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 12, fill: '#737373' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="title" tick={{ fontSize: 11, fill: '#737373' }} axisLine={false} tickLine={false} width={120} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="borrows" fill="#6366F1" radius={[0, 8, 8, 0]} barSize={20} name="Borrows" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Genre Popularity */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={2} className="glass-card">
          <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-1">Genre Popularity</h3>
          <p className="text-sm text-surface-500 mb-4">Distribution by category</p>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={analyticsData.genreDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={4}
                dataKey="value"
                label={({ name, value }) => `${name} ${value}%`}
              >
                {analyticsData.genreDistribution.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip {...tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Member Activity Heatmap */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3} className="glass-card">
          <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-1">Member Activity Heatmap</h3>
          <p className="text-sm text-surface-500 mb-4">Library visits by day and time</p>
          <div className="space-y-2">
            <div className="grid grid-cols-8 gap-2 text-xs text-surface-500">
              <div></div>
              {analyticsData.memberActivity.map(d => (
                <div key={d.day} className="text-center font-medium">{d.day}</div>
              ))}
            </div>
            {['Morning', 'Afternoon', 'Evening'].map((period, pi) => {
              const key = period.toLowerCase();
              return (
                <div key={period} className="grid grid-cols-8 gap-2 items-center">
                  <span className="text-xs text-surface-500">{period}</span>
                  {analyticsData.memberActivity.map((d, di) => {
                    const val = d[key];
                    const maxVal = 30;
                    const intensity = val / maxVal;
                    return (
                      <motion.div
                        key={di}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: (pi * 7 + di) * 0.03 }}
                        className="aspect-square rounded-lg flex items-center justify-center text-xs font-medium cursor-pointer transition-transform hover:scale-110"
                        style={{
                          backgroundColor: `rgba(99, 102, 241, ${0.1 + intensity * 0.8})`,
                          color: intensity > 0.5 ? 'white' : '#6366F1',
                        }}
                        title={`${d.day} ${period}: ${val} visits`}
                      >
                        {val}
                      </motion.div>
                    );
                  })}
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-end gap-2 mt-4">
            <span className="text-xs text-surface-500">Less</span>
            {[0.1, 0.3, 0.5, 0.7, 0.9].map((opacity, i) => (
              <div key={i} className="w-4 h-4 rounded" style={{ backgroundColor: `rgba(99, 102, 241, ${opacity})` }} />
            ))}
            <span className="text-xs text-surface-500">More</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
