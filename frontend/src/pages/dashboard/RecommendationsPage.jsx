import { motion } from 'framer-motion';
import { Brain, Sparkles, TrendingUp, Star, BookOpen, Zap } from 'lucide-react';
import { recommendations } from '../../data/mockData';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.1 } })
};

export default function RecommendationsPage() {
  const trending = recommendations.filter(r => r.algorithm === 'Popularity' || r.confidence > 85);
  const forYou = recommendations.filter(r => r.algorithm === 'Content-Based');
  const collaborative = recommendations.filter(r => r.algorithm === 'Collaborative');

  const BookCard = ({ rec, index }) => (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeUp}
      custom={index}
      className="glass-card-hover group"
    >
      <div className="relative mb-4">
        <img src={rec.book.cover} alt={rec.book.title} className="w-full h-56 object-cover rounded-xl shadow-sm" />
        <div className="absolute top-2 right-2 bg-white/90 dark:bg-surface-800/90 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1">
          <Zap className="w-3 h-3 text-primary-500" />
          <span className="text-xs font-bold text-primary-600 dark:text-primary-400">{rec.confidence}%</span>
        </div>
        <div className="absolute top-2 left-2">
          <span className="badge bg-white/90 dark:bg-surface-800/90 backdrop-blur-sm text-surface-700 dark:text-surface-300 text-xs">
            {rec.algorithm}
          </span>
        </div>
      </div>
      <h4 className="text-sm font-semibold text-surface-900 dark:text-white mb-1 line-clamp-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
        {rec.book.title}
      </h4>
      <p className="text-xs text-surface-500 mb-2">{rec.book.author}</p>
      <p className="text-xs text-surface-400 dark:text-surface-500 mb-3">{rec.reason}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span className="text-xs font-medium text-surface-700 dark:text-surface-300">{rec.book.rating}</span>
        </div>
        <span className="badge-info text-xs">{rec.book.category}</span>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-surface-900 dark:text-white flex items-center gap-2">
          <Brain className="w-7 h-7 text-primary-500" />
          AI Book Recommendations
        </h2>
        <p className="text-sm text-surface-500 mt-1">Personalized suggestions powered by machine learning</p>
      </div>

      {/* AI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Recommendation Accuracy', value: '94.7%', icon: Brain, color: 'from-primary-500 to-violet-500' },
          { label: 'Books Analyzed', value: '12,847', icon: BookOpen, color: 'from-emerald-500 to-teal-500' },
          { label: 'Reading Patterns Found', value: '1,429', icon: TrendingUp, color: 'from-amber-500 to-orange-500' },
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

      {/* Recommended For You */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-primary-500" />
          <h3 className="text-lg font-semibold text-surface-900 dark:text-white">Recommended for You</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {forYou.map((rec, i) => (
            <BookCard key={rec.id} rec={rec} index={i} />
          ))}
        </div>
      </div>

      {/* Trending */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-emerald-500" />
          <h3 className="text-lg font-semibold text-surface-900 dark:text-white">Trending in Your Category</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {trending.map((rec, i) => (
            <BookCard key={rec.id} rec={rec} index={i} />
          ))}
        </div>
      </div>

      {/* Similar Readers Also Liked */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Star className="w-5 h-5 text-amber-500" />
          <h3 className="text-lg font-semibold text-surface-900 dark:text-white">Similar Readers Also Liked</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {collaborative.map((rec, i) => (
            <BookCard key={rec.id} rec={rec} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
