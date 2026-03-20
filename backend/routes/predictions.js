const express = require('express');
const { query } = require('../config/db');
const { authenticate } = require('../middleware/auth');
const { predictLateReturns, predictFines } = require('../ai/predictions');
const { predictAvailability } = require('../ai/availability');

const router = express.Router();

// GET /api/predictions/late-returns — Predict which members will return late
router.get('/late-returns', authenticate, async (req, res) => {
  try {
    // Get all active transactions
    const activeResult = await query(
      `SELECT t.*, b.title as book_title, b.author as book_author,
              u.name as member_name, u.email as member_email,
              m.total_fines, m.books_borrowed,
              (SELECT COUNT(*) FROM transactions t2 WHERE t2.member_id = t.member_id AND t2.status = 'Returned Late') as late_count,
              (SELECT COUNT(*) FROM transactions t3 WHERE t3.member_id = t.member_id) as total_transactions
       FROM transactions t
       JOIN books b ON b.id = t.book_id
       JOIN members m ON m.id = t.member_id
       JOIN users u ON u.id = m.user_id
       WHERE t.status IN ('Issued', 'Overdue')
       ORDER BY t.due_date ASC`
    );

    const predictions = predictLateReturns(activeResult.rows);

    res.json({
      predictions,
      summary: {
        high: predictions.filter(p => p.riskLevel === 'High').length,
        medium: predictions.filter(p => p.riskLevel === 'Medium').length,
        low: predictions.filter(p => p.riskLevel === 'Low').length,
        totalEstimatedFines: predictions.reduce((s, p) => s + p.estimatedFine, 0).toFixed(2)
      }
    });
  } catch (error) {
    console.error('Late returns prediction error:', error);
    res.status(500).json({ error: 'Failed to predict late returns.' });
  }
});

// GET /api/predictions/fines — Fine prediction and history
router.get('/fines', authenticate, async (req, res) => {
  try {
    // Monthly fine history
    const historyResult = await query(`
      SELECT 
        TO_CHAR(return_date, 'Mon') as month,
        EXTRACT(MONTH FROM return_date) as month_num,
        SUM(fine_amount) as total_fines,
        COUNT(*) as late_returns
      FROM transactions
      WHERE fine_amount > 0 AND return_date IS NOT NULL
        AND return_date >= NOW() - INTERVAL '12 months'
      GROUP BY TO_CHAR(return_date, 'Mon'), EXTRACT(MONTH FROM return_date)
      ORDER BY month_num
    `);

    // Top fined members
    const topFinedResult = await query(`
      SELECT u.name, m.total_fines, m.books_borrowed,
             COUNT(t.id) FILTER (WHERE t.status = 'Returned Late') as late_count
      FROM members m
      JOIN users u ON u.id = m.user_id
      LEFT JOIN transactions t ON t.member_id = m.id
      WHERE m.total_fines > 0
      GROUP BY u.name, m.total_fines, m.books_borrowed
      ORDER BY m.total_fines DESC
      LIMIT 10
    `);

    res.json({
      fineHistory: historyResult.rows,
      topFined: topFinedResult.rows
    });
  } catch (error) {
    console.error('Fine predictions error:', error);
    res.status(500).json({ error: 'Failed to fetch fine predictions.' });
  }
});

// GET /api/predictions/availability — Predict when books will be available
router.get('/availability', authenticate, async (req, res) => {
  try {
    // Get unavailable books with current borrower info
    const unavailableResult = await query(
      `SELECT b.id, b.title, b.author, b.copies_total, b.copies_available, b.total_borrows,
              t.due_date, t.issue_date, t.member_id,
              u.name as current_borrower,
              (SELECT COUNT(*) FROM transactions t2 WHERE t2.book_id = b.id AND t2.status IN ('Issued', 'Overdue')) as active_borrows,
              (SELECT AVG(EXTRACT(DAY FROM (t3.return_date - t3.issue_date))) 
               FROM transactions t3 WHERE t3.book_id = b.id AND t3.return_date IS NOT NULL) as avg_borrow_days
       FROM books b
       JOIN transactions t ON t.book_id = b.id AND t.status IN ('Issued', 'Overdue')
       JOIN members m ON m.id = t.member_id
       JOIN users u ON u.id = m.user_id
       WHERE b.copies_available <= 1
       ORDER BY t.due_date ASC`
    );

    const predictions = predictAvailability(unavailableResult.rows);

    // Demand data
    const demandResult = await query(`
      SELECT 
        TO_CHAR(created_at, 'Dy') as day,
        COUNT(*) as searches
      FROM analytics_log
      WHERE event_type = 'book_searched' AND created_at >= NOW() - INTERVAL '7 days'
      GROUP BY TO_CHAR(created_at, 'Dy'), EXTRACT(DOW FROM created_at)
      ORDER BY EXTRACT(DOW FROM created_at)
    `);

    res.json({
      predictions,
      demand: demandResult.rows
    });
  } catch (error) {
    console.error('Availability prediction error:', error);
    res.status(500).json({ error: 'Failed to predict availability.' });
  }
});

module.exports = router;
