/**
 * AI Analytics Engine
 * 
 * Provides computed analytics and insights:
 * - Borrow frequency analysis
 * - Genre popularity scoring with trends
 * - Member engagement metrics
 * - Anomaly detection
 */

/**
 * Analyze borrowing frequency patterns
 */
function analyzeBorrowFrequency(transactions) {
  const hourCounts = new Array(24).fill(0);
  const dayCounts = new Array(7).fill(0);
  const monthCounts = new Array(12).fill(0);

  transactions.forEach(t => {
    const date = new Date(t.created_at || t.issue_date);
    hourCounts[date.getHours()]++;
    dayCounts[date.getDay()]++;
    monthCounts[date.getMonth()]++;
  });

  const peakHour = hourCounts.indexOf(Math.max(...hourCounts));
  const peakDay = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayCounts.indexOf(Math.max(...dayCounts))];
  const peakMonth = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][monthCounts.indexOf(Math.max(...monthCounts))];

  return {
    hourlyDistribution: hourCounts,
    dailyDistribution: dayCounts,
    monthlyDistribution: monthCounts,
    peaks: { hour: peakHour, day: peakDay, month: peakMonth },
    totalTransactions: transactions.length
  };
}

/**
 * Score genre popularity and detect trends
 */
function scoreGenrePopularity(books, recentTransactions) {
  const genreScores = {};

  books.forEach(book => {
    if (!genreScores[book.category]) {
      genreScores[book.category] = { 
        totalBooks: 0, 
        totalBorrows: 0, 
        avgRating: 0, 
        recentBorrows: 0,
        ratings: [] 
      };
    }
    const genre = genreScores[book.category];
    genre.totalBooks++;
    genre.totalBorrows += book.total_borrows || 0;
    if (book.average_rating) genre.ratings.push(parseFloat(book.average_rating));
  });

  // Count recent borrows per genre
  recentTransactions.forEach(t => {
    if (t.category && genreScores[t.category]) {
      genreScores[t.category].recentBorrows++;
    }
  });

  // Calculate final scores
  const results = Object.entries(genreScores).map(([genre, data]) => {
    data.avgRating = data.ratings.length > 0 
      ? (data.ratings.reduce((s, r) => s + r, 0) / data.ratings.length).toFixed(2)
      : 0;

    // Composite popularity score: 40% borrows + 30% recent + 30% rating
    const maxBorrows = Math.max(...Object.values(genreScores).map(g => g.totalBorrows));
    const normalizedBorrows = maxBorrows > 0 ? data.totalBorrows / maxBorrows : 0;
    const normalizedRating = data.avgRating / 5;
    const maxRecent = Math.max(...Object.values(genreScores).map(g => g.recentBorrows)) || 1;
    const normalizedRecent = data.recentBorrows / maxRecent;

    const popularityScore = Math.round(
      (normalizedBorrows * 40 + normalizedRecent * 30 + normalizedRating * 30)
    );

    // Trend: compare recent borrows to historical average
    const avgBorrowsPerBook = data.totalBooks > 0 ? data.totalBorrows / data.totalBooks : 0;
    let trend;
    if (data.recentBorrows > avgBorrowsPerBook * 0.15) trend = 'rising';
    else if (data.recentBorrows < avgBorrowsPerBook * 0.05) trend = 'declining';
    else trend = 'stable';

    return {
      genre,
      ...data,
      popularityScore,
      trend
    };
  });

  return results.sort((a, b) => b.popularityScore - a.popularityScore);
}

/**
 * Calculate member engagement metrics
 */
function calculateEngagement(members) {
  return members.map(member => {
    const borrowRate = member.max_books > 0 
      ? (member.books_borrowed / member.max_books) * 100 
      : 0;

    let engagementLevel;
    if (borrowRate >= 80) engagementLevel = 'Very Active';
    else if (borrowRate >= 50) engagementLevel = 'Active';
    else if (borrowRate >= 20) engagementLevel = 'Moderate';
    else engagementLevel = 'Inactive';

    return {
      memberId: member.id,
      name: member.name || 'Unknown',
      borrowRate: Math.round(borrowRate),
      engagementLevel,
      booksBorrowed: member.books_borrowed,
      maxBooks: member.max_books,
      totalFines: parseFloat(member.total_fines || 0).toFixed(2)
    };
  }).sort((a, b) => b.borrowRate - a.borrowRate);
}

module.exports = {
  analyzeBorrowFrequency,
  scoreGenrePopularity,
  calculateEngagement
};
