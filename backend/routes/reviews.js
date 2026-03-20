const express = require('express');
const { query } = require('../config/db');
const { authenticate, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Simple sentiment analysis
function analyzeSentiment(text) {
  const positiveWords = ['great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'love', 'best', 'masterpiece', 'brilliant', 'outstanding', 'incredible', 'essential', 'beautiful', 'practical', 'inspiring', 'rewarding', 'fascinating', 'timeless', 'engaging', 'thought-provoking'];
  const negativeWords = ['bad', 'terrible', 'awful', 'worst', 'boring', 'disappointing', 'waste', 'poor', 'dull', 'mediocre', 'confusing', 'outdated', 'overrated'];
  
  const lower = text.toLowerCase();
  const posCount = positiveWords.filter(w => lower.includes(w)).length;
  const negCount = negativeWords.filter(w => lower.includes(w)).length;
  
  if (posCount > negCount) return 'Positive';
  if (negCount > posCount) return 'Negative';
  return 'Neutral';
}

// GET /api/reviews — List reviews (optionally by book)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { book_id, sort = 'helpful', page = 1, limit = 20 } = req.query;
    
    let whereClause = 'WHERE 1=1';
    const params = [];
    let paramCount = 0;

    if (book_id) {
      paramCount++;
      whereClause += ` AND r.book_id = $${paramCount}`;
      params.push(book_id);
    }

    const sortMap = {
      helpful: 'r.helpful_count DESC',
      recent: 'r.created_at DESC',
      highest: 'r.rating DESC',
      lowest: 'r.rating ASC'
    };
    const orderBy = sortMap[sort] || sortMap.helpful;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const result = await query(
      `SELECT r.*, u.name as user_name, b.title as book_title, b.author as book_author
       FROM reviews r
       JOIN users u ON u.id = r.user_id
       JOIN books b ON b.id = r.book_id
       ${whereClause}
       ORDER BY ${orderBy}
       LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`,
      [...params, parseInt(limit), offset]
    );

    // Get aggregates if filtering by book
    let aggregates = null;
    if (book_id) {
      const aggResult = await query(
        `SELECT 
          COUNT(*) as total_reviews,
          COALESCE(AVG(rating), 0) as average_rating,
          COUNT(*) FILTER (WHERE sentiment = 'Positive') as positive_count,
          COUNT(*) FILTER (WHERE sentiment = 'Neutral') as neutral_count,
          COUNT(*) FILTER (WHERE sentiment = 'Negative') as negative_count,
          COUNT(*) FILTER (WHERE rating = 5) as five_star,
          COUNT(*) FILTER (WHERE rating = 4) as four_star,
          COUNT(*) FILTER (WHERE rating = 3) as three_star,
          COUNT(*) FILTER (WHERE rating = 2) as two_star,
          COUNT(*) FILTER (WHERE rating = 1) as one_star
         FROM reviews WHERE book_id = $1`,
        [book_id]
      );
      aggregates = aggResult.rows[0];
    }

    res.json({ reviews: result.rows, aggregates });
  } catch (error) {
    console.error('List reviews error:', error);
    res.status(500).json({ error: 'Failed to fetch reviews.' });
  }
});

// POST /api/reviews — Create a review
router.post('/', authenticate, async (req, res) => {
  try {
    const { book_id, rating, comment } = req.body;

    if (!book_id || !rating) {
      return res.status(400).json({ error: 'Book ID and rating are required.' });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5.' });
    }

    // Check duplicate
    const existing = await query(
      'SELECT id FROM reviews WHERE book_id = $1 AND user_id = $2',
      [book_id, req.user.id]
    );
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'You have already reviewed this book.' });
    }

    const sentiment = comment ? analyzeSentiment(comment) : 'Neutral';

    const result = await query(
      `INSERT INTO reviews (book_id, user_id, rating, comment, sentiment)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [book_id, req.user.id, rating, comment, sentiment]
    );

    // Log analytics
    await query(
      `INSERT INTO analytics_log (event_type, book_id, member_id, metadata)
       VALUES ('review_posted', $1, (SELECT id FROM members WHERE user_id = $2 LIMIT 1), $3)`,
      [book_id, req.user.id, JSON.stringify({ rating, sentiment })]
    );

    res.status(201).json({ review: result.rows[0], message: 'Review submitted successfully' });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ error: 'Failed to create review.' });
  }
});

// PUT /api/reviews/:id/helpful — Upvote a review
router.put('/:id/helpful', authenticate, async (req, res) => {
  try {
    const result = await query(
      `UPDATE reviews SET helpful_count = helpful_count + 1 WHERE id = $1 RETURNING *`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Review not found.' });
    }

    res.json({ review: result.rows[0], message: 'Marked as helpful' });
  } catch (error) {
    console.error('Upvote error:', error);
    res.status(500).json({ error: 'Failed to upvote review.' });
  }
});

// DELETE /api/reviews/:id — Delete own review or admin delete
router.delete('/:id', authenticate, async (req, res) => {
  try {
    let whereClause = 'WHERE id = $1';
    const params = [req.params.id];

    if (req.user.role !== 'admin') {
      whereClause += ' AND user_id = $2';
      params.push(req.user.id);
    }

    const result = await query(`DELETE FROM reviews ${whereClause} RETURNING id`, params);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Review not found or not authorized.' });
    }

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ error: 'Failed to delete review.' });
  }
});

module.exports = router;
