import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, ThumbsUp, MessageSquare, Search, TrendingUp, Smile, Meh, Frown, Send } from 'lucide-react';
import { reviews, books } from '../../data/mockData';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.1 } })
};

export default function ReviewsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRating, setSelectedRating] = useState(0);
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' });
  const [hoveredStar, setHoveredStar] = useState(0);

  const filteredReviews = reviews.filter(r => {
    const matchesSearch = r.bookTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.userName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRating = selectedRating === 0 || r.rating === selectedRating;
    return matchesSearch && matchesRating;
  });

  const avgRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);
  const ratingDist = [5, 4, 3, 2, 1].map(r => ({
    stars: r,
    count: reviews.filter(rev => rev.rating === r).length,
    percentage: (reviews.filter(rev => rev.rating === r).length / reviews.length) * 100
  }));

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'Positive': return <Smile className="w-4 h-4 text-emerald-500" />;
      case 'Neutral': return <Meh className="w-4 h-4 text-amber-500" />;
      case 'Negative': return <Frown className="w-4 h-4 text-red-500" />;
      default: return null;
    }
  };

  const getSentimentBadge = (sentiment) => {
    switch (sentiment) {
      case 'Positive': return 'badge-success';
      case 'Neutral': return 'badge-warning';
      case 'Negative': return 'badge-danger';
      default: return 'badge-info';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-surface-900 dark:text-white flex items-center gap-2">
          <Star className="w-7 h-7 text-amber-400 fill-amber-400" />
          Book Ratings & Reviews
        </h2>
        <p className="text-sm text-surface-500 mt-1">Community reviews with AI sentiment analysis</p>
      </div>

      {/* Overview Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="glass-card text-center">
          <p className="text-5xl font-bold gradient-text mb-1">{avgRating}</p>
          <div className="flex justify-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map(s => (
              <Star key={s} className={`w-5 h-5 ${s <= Math.round(avgRating) ? 'text-amber-400 fill-amber-400' : 'text-surface-300'}`} />
            ))}
          </div>
          <p className="text-sm text-surface-500">Average Rating ({reviews.length} reviews)</p>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={1} className="glass-card">
          <h4 className="text-sm font-semibold text-surface-900 dark:text-white mb-3">Rating Distribution</h4>
          <div className="space-y-2">
            {ratingDist.map(r => (
              <div key={r.stars} className="flex items-center gap-2">
                <span className="text-xs text-surface-500 w-3">{r.stars}</span>
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <div className="flex-1 bg-surface-200 dark:bg-surface-700 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${r.percentage}%` }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="h-2 rounded-full bg-amber-400"
                  />
                </div>
                <span className="text-xs text-surface-500 w-6 text-right">{r.count}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={2} className="glass-card">
          <h4 className="text-sm font-semibold text-surface-900 dark:text-white mb-3">Sentiment Analysis</h4>
          <div className="space-y-3">
            {[
              { label: 'Positive', count: reviews.filter(r => r.sentiment === 'Positive').length, color: 'bg-emerald-500', icon: Smile },
              { label: 'Neutral', count: reviews.filter(r => r.sentiment === 'Neutral').length, color: 'bg-amber-500', icon: Meh },
              { label: 'Negative', count: reviews.filter(r => r.sentiment === 'Negative').length, color: 'bg-red-500', icon: Frown },
            ].map((s, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors">
                <div className="flex items-center gap-2">
                  <s.icon className={`w-5 h-5 ${s.label === 'Positive' ? 'text-emerald-500' : s.label === 'Neutral' ? 'text-amber-500' : 'text-red-500'}`} />
                  <span className="text-sm text-surface-700 dark:text-surface-300">{s.label}</span>
                </div>
                <span className="text-sm font-bold text-surface-900 dark:text-white">{s.count}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Search & Filter */}
      <div className="glass-card !p-4 flex flex-col md:flex-row gap-4">
        <div className="flex items-center gap-2 bg-surface-50 dark:bg-surface-700 rounded-xl px-4 py-2.5 border border-surface-200 dark:border-surface-600 flex-1 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/20 transition-all">
          <Search className="w-4 h-4 text-surface-400" />
          <input
            type="text"
            placeholder="Search reviews..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-sm text-surface-900 dark:text-surface-100 placeholder-surface-400 w-full"
          />
        </div>
        <div className="flex gap-2 items-center">
          <span className="text-sm text-surface-500">Filter:</span>
          {[0, 5, 4, 3, 2, 1].map(r => (
            <button
              key={r}
              onClick={() => setSelectedRating(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedRating === r
                  ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                  : 'text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-700'
              }`}
            >{r === 0 ? 'All' : `${r}★`}</button>
          ))}
        </div>
      </div>

      {/* Write Review */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3} className="glass-card">
        <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-primary-500" />
          Write a Review
        </h3>
        <div className="space-y-4">
          <select className="input-field">
            <option value="">Select a book...</option>
            {books.map(b => <option key={b.id} value={b.id}>{b.title}</option>)}
          </select>
          <div className="flex items-center gap-2">
            <span className="text-sm text-surface-500">Your rating:</span>
            {[1, 2, 3, 4, 5].map(s => (
              <button
                key={s}
                onMouseEnter={() => setHoveredStar(s)}
                onMouseLeave={() => setHoveredStar(0)}
                onClick={() => setNewReview({ ...newReview, rating: s })}
              >
                <Star className={`w-6 h-6 transition-colors ${
                  s <= (hoveredStar || newReview.rating) ? 'text-amber-400 fill-amber-400' : 'text-surface-300 dark:text-surface-600'
                }`} />
              </button>
            ))}
          </div>
          <textarea
            placeholder="Write your review..."
            rows={3}
            value={newReview.comment}
            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
            className="input-field resize-none"
          />
          <button className="btn-primary flex items-center gap-2">
            <Send className="w-4 h-4" />
            Submit Review
          </button>
        </div>
      </motion.div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review, i) => (
          <motion.div key={review.id} initial="hidden" animate="visible" variants={fadeUp} custom={i} className="glass-card">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-violet-500 flex items-center justify-center text-white font-semibold text-sm">
                  {review.userName.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-sm font-semibold text-surface-900 dark:text-white">{review.userName}</p>
                  <p className="text-xs text-surface-500">Reviewed <span className="font-medium text-primary-600 dark:text-primary-400">{review.bookTitle}</span></p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`${getSentimentBadge(review.sentiment)} flex items-center gap-1`}>
                  {getSentimentIcon(review.sentiment)}
                  {review.sentiment}
                </span>
              </div>
            </div>
            <div className="flex gap-1 mb-2">
              {[1, 2, 3, 4, 5].map(s => (
                <Star key={s} className={`w-4 h-4 ${s <= review.rating ? 'text-amber-400 fill-amber-400' : 'text-surface-300'}`} />
              ))}
            </div>
            <p className="text-sm text-surface-600 dark:text-surface-400 leading-relaxed mb-3">{review.comment}</p>
            <div className="flex items-center justify-between">
              <button className="flex items-center gap-1.5 text-xs text-surface-500 hover:text-primary-500 transition-colors group">
                <ThumbsUp className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                Helpful ({review.helpful})
              </button>
              <span className="text-xs text-surface-400">{review.date}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
