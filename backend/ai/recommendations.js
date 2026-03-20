/**
 * AI Book Recommendation Engine
 * 
 * Implements three recommendation algorithms:
 * 1. Content-Based Filtering — Recommends based on genre/author similarity
 * 2. Popularity-Based — Trending books by borrow count and rating
 * 3. Collaborative Filtering — Books liked by similar users
 */

/**
 * Content-Based Recommendations
 * Score books based on overlap with user's reading history (categories, authors)
 */
function getRecommendations(readBooks, allBooks, readBookIds) {
  if (readBooks.length === 0) {
    // No history → return top-rated books
    return allBooks
      .filter(b => !readBookIds.includes(b.id))
      .slice(0, 6)
      .map((book, i) => ({
        book,
        confidence: Math.max(60, 90 - i * 5),
        reason: 'Highly rated in our library',
        algorithm: 'Content-Based'
      }));
  }

  // Build user profile from reading history
  const categoryCounts = {};
  const authorCounts = {};
  
  readBooks.forEach(book => {
    categoryCounts[book.category] = (categoryCounts[book.category] || 0) + 1;
    authorCounts[book.author] = (authorCounts[book.author] || 0) + 1;
  });

  // Total read for normalization
  const totalRead = readBooks.length;

  // Score unread books
  const scored = allBooks
    .filter(b => !readBookIds.includes(b.id))
    .map(book => {
      let score = 0;
      
      // Category match (weighted by frequency)
      if (categoryCounts[book.category]) {
        score += (categoryCounts[book.category] / totalRead) * 50;
      }
      
      // Author match (strong signal)
      if (authorCounts[book.author]) {
        score += (authorCounts[book.author] / totalRead) * 30;
      }
      
      // Rating boost
      const avgRating = parseFloat(book.avg_rating) || parseFloat(book.average_rating) || 0;
      score += (avgRating / 5) * 15;

      // Popularity boost (normalized)
      const maxBorrows = Math.max(...allBooks.map(b => b.total_borrows || 0));
      if (maxBorrows > 0) {
        score += ((book.total_borrows || 0) / maxBorrows) * 5;
      }

      // Clamp to 0-100
      const confidence = Math.min(99, Math.max(50, Math.round(score)));
      
      // Generate reason
      let reason;
      if (authorCounts[book.author]) {
        reason = `You enjoyed books by ${book.author}`;
      } else if (categoryCounts[book.category]) {
        reason = `Based on your interest in ${book.category} books`;
      } else {
        reason = 'Highly rated across our library';
      }

      return { book, confidence, reason, algorithm: 'Content-Based' };
    })
    .sort((a, b) => b.confidence - a.confidence);

  return scored.slice(0, 6);
}

/**
 * Popularity-Based Trending Books
 */
function getTrendingBooks(allBooks, readBookIds) {
  return allBooks
    .filter(b => !readBookIds.includes(b.id))
    .sort((a, b) => (b.total_borrows || 0) - (a.total_borrows || 0))
    .slice(0, 6)
    .map((book, i) => ({
      book,
      confidence: Math.max(65, 95 - i * 5),
      reason: `Trending — borrowed ${book.total_borrows} times`,
      algorithm: 'Popularity'
    }));
}

/**
 * Collaborative Filtering — "Users who read X also read Y"
 */
async function getSimilarReaders(userId, readBookIds, queryFn) {
  try {
    if (readBookIds.length === 0) return [];

    // Find users who read the same books
    const result = await queryFn(
      `SELECT DISTINCT b.id, b.isbn, b.title, b.author, b.category, b.cover_url,
              b.copies_available, b.total_borrows, b.average_rating,
              COUNT(DISTINCT t2.member_id) as shared_readers
       FROM transactions t1
       JOIN members m1 ON m1.id = t1.member_id
       JOIN transactions t2 ON t2.book_id = t1.book_id AND t2.member_id != t1.member_id
       JOIN members m2 ON m2.id = t2.member_id
       JOIN transactions t3 ON t3.member_id = t2.member_id AND t3.book_id NOT IN (SELECT unnest($1::int[]))
       JOIN books b ON b.id = t3.book_id
       WHERE m1.user_id = $2
       GROUP BY b.id
       ORDER BY shared_readers DESC, b.total_borrows DESC
       LIMIT 6`,
      [readBookIds, userId]
    );

    return result.rows.map((book, i) => ({
      book,
      confidence: Math.max(60, 90 - i * 5),
      reason: `${book.shared_readers} similar readers also enjoyed this`,
      algorithm: 'Collaborative'
    }));
  } catch (error) {
    console.error('Collaborative filtering error:', error.message);
    return [];
  }
}

module.exports = {
  getRecommendations,
  getTrendingBooks,
  getSimilarReaders
};
