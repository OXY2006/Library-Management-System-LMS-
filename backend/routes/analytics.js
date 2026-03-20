const express = require('express');
const { query } = require('../config/db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// GET /api/analytics/overview — Dashboard overview stats
router.get('/overview', authenticate, async (req, res) => {
  try {
    const stats = await query(`
      SELECT
        (SELECT COUNT(*) FROM books) as total_books,
        (SELECT SUM(copies_total) FROM books) as total_copies,
        (SELECT COUNT(*) FROM members WHERE status = 'Active') as active_members,
        (SELECT COUNT(*) FROM transactions WHERE status = 'Issued') as books_issued,
        (SELECT COUNT(*) FROM transactions WHERE status = 'Overdue' OR (status = 'Issued' AND due_date < CURRENT_DATE)) as overdue_count,
        (SELECT COALESCE(SUM(fine_amount), 0) FROM transactions WHERE fine_amount > 0) as total_fines,
        (SELECT COUNT(*) FROM reviews) as total_reviews,
        (SELECT COALESCE(AVG(rating), 0) FROM reviews) as avg_rating
    `);

    res.json({ stats: stats.rows[0] });
  } catch (error) {
    console.error('Overview error:', error);
    res.status(500).json({ error: 'Failed to fetch overview.' });
  }
});

// GET /api/analytics/monthly-borrows — Monthly borrowing trends
router.get('/monthly-borrows', authenticate, async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        TO_CHAR(created_at, 'Mon') as month,
        EXTRACT(MONTH FROM created_at) as month_num,
        COUNT(*) FILTER (WHERE event_type = 'book_borrowed') as borrows,
        COUNT(*) FILTER (WHERE event_type = 'book_returned') as returns
      FROM analytics_log
      WHERE created_at >= NOW() - INTERVAL '12 months'
      GROUP BY TO_CHAR(created_at, 'Mon'), EXTRACT(MONTH FROM created_at)
      ORDER BY month_num
    `);

    res.json({ data: result.rows });
  } catch (error) {
    console.error('Monthly borrows error:', error);
    res.status(500).json({ error: 'Failed to fetch monthly data.' });
  }
});

// GET /api/analytics/genre-distribution — Books by genre
router.get('/genre-distribution', authenticate, async (req, res) => {
  try {
    const result = await query(`
      SELECT category as name, COUNT(*) as value,
             ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM books), 1) as percentage
      FROM books
      GROUP BY category
      ORDER BY value DESC
    `);

    const colors = ['#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#EF4444'];
    const data = result.rows.map((row, i) => ({
      ...row,
      color: colors[i % colors.length]
    }));

    res.json({ data });
  } catch (error) {
    console.error('Genre distribution error:', error);
    res.status(500).json({ error: 'Failed to fetch genre data.' });
  }
});

// GET /api/analytics/top-books — Most borrowed books
router.get('/top-books', authenticate, async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const result = await query(
      `SELECT title, author, total_borrows as borrows, average_rating, category
       FROM books
       ORDER BY total_borrows DESC
       LIMIT $1`,
      [parseInt(limit)]
    );

    res.json({ data: result.rows });
  } catch (error) {
    console.error('Top books error:', error);
    res.status(500).json({ error: 'Failed to fetch top books.' });
  }
});

// GET /api/analytics/member-activity — Activity heatmap data
router.get('/member-activity', authenticate, async (req, res) => {
  try {
    const result = await query(`
      SELECT
        TO_CHAR(created_at, 'Dy') as day,
        EXTRACT(DOW FROM created_at) as day_num,
        COUNT(*) FILTER (WHERE EXTRACT(HOUR FROM created_at) BETWEEN 6 AND 11) as morning,
        COUNT(*) FILTER (WHERE EXTRACT(HOUR FROM created_at) BETWEEN 12 AND 17) as afternoon,
        COUNT(*) FILTER (WHERE EXTRACT(HOUR FROM created_at) BETWEEN 18 AND 23) as evening
      FROM analytics_log
      WHERE created_at >= NOW() - INTERVAL '30 days'
      GROUP BY TO_CHAR(created_at, 'Dy'), EXTRACT(DOW FROM created_at)
      ORDER BY day_num
    `);

    res.json({ data: result.rows });
  } catch (error) {
    console.error('Member activity error:', error);
    res.status(500).json({ error: 'Failed to fetch activity data.' });
  }
});

// GET /api/analytics/recent-activity — Recent library events
router.get('/recent-activity', authenticate, async (req, res) => {
  try {
    const result = await query(`
      SELECT al.event_type, al.created_at,
             b.title as book_title,
             u.name as member_name,
             al.metadata
      FROM analytics_log al
      LEFT JOIN books b ON b.id = al.book_id
      LEFT JOIN members m ON m.id = al.member_id
      LEFT JOIN users u ON u.id = m.user_id
      ORDER BY al.created_at DESC
      LIMIT 20
    `);

    res.json({ data: result.rows });
  } catch (error) {
    console.error('Recent activity error:', error);
    res.status(500).json({ error: 'Failed to fetch recent activity.' });
  }
});

module.exports = router;
