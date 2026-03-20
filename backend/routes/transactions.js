const express = require('express');
const { query, getClient } = require('../config/db');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// GET /api/transactions — List transactions
router.get('/', authenticate, async (req, res) => {
  try {
    const { status, member_id, book_id, page = 1, limit = 20 } = req.query;
    
    let whereClause = 'WHERE 1=1';
    const params = [];
    let paramCount = 0;

    if (status) {
      paramCount++;
      whereClause += ` AND t.status = $${paramCount}`;
      params.push(status);
    }
    if (member_id) {
      paramCount++;
      whereClause += ` AND t.member_id = $${paramCount}`;
      params.push(member_id);
    }
    if (book_id) {
      paramCount++;
      whereClause += ` AND t.book_id = $${paramCount}`;
      params.push(book_id);
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const result = await query(
      `SELECT t.*, b.title as book_title, b.author as book_author, b.isbn,
              u.name as member_name, u.email as member_email
       FROM transactions t
       JOIN books b ON b.id = t.book_id
       JOIN members m ON m.id = t.member_id
       JOIN users u ON u.id = m.user_id
       ${whereClause}
       ORDER BY t.created_at DESC
       LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`,
      [...params, parseInt(limit), offset]
    );

    const countResult = await query(
      `SELECT COUNT(*) FROM transactions t ${whereClause}`, params
    );

    res.json({
      transactions: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(countResult.rows[0].count),
        pages: Math.ceil(parseInt(countResult.rows[0].count) / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('List transactions error:', error);
    res.status(500).json({ error: 'Failed to fetch transactions.' });
  }
});

// POST /api/transactions/issue — Issue a book
router.post('/issue', authenticate, authorize('admin', 'librarian'), async (req, res) => {
  const client = await getClient();
  
  try {
    const { book_id, member_id, due_date } = req.body;

    if (!book_id || !member_id) {
      return res.status(400).json({ error: 'Book ID and Member ID are required.' });
    }

    await client.query('BEGIN');

    // Check book availability
    const bookResult = await client.query('SELECT * FROM books WHERE id = $1', [book_id]);
    if (bookResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Book not found.' });
    }
    if (bookResult.rows[0].copies_available <= 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'No copies available.' });
    }

    // Check member status
    const memberResult = await client.query('SELECT * FROM members WHERE id = $1', [member_id]);
    if (memberResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Member not found.' });
    }
    if (memberResult.rows[0].status !== 'Active') {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Member account is not active.' });
    }
    if (memberResult.rows[0].books_borrowed >= memberResult.rows[0].max_books) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Member has reached maximum borrow limit.' });
    }

    // Check for duplicate active issue
    const duplicateResult = await client.query(
      `SELECT id FROM transactions WHERE book_id = $1 AND member_id = $2 AND status = 'Issued'`,
      [book_id, member_id]
    );
    if (duplicateResult.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'This book is already issued to this member.' });
    }

    // Create transaction
    const dueDate = due_date || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const transResult = await client.query(
      `INSERT INTO transactions (book_id, member_id, due_date, status)
       VALUES ($1, $2, $3, 'Issued')
       RETURNING *`,
      [book_id, member_id, dueDate]
    );

    // Update book copies
    await client.query(
      'UPDATE books SET copies_available = copies_available - 1, total_borrows = total_borrows + 1 WHERE id = $1',
      [book_id]
    );

    // Update member borrowed count
    await client.query(
      'UPDATE members SET books_borrowed = books_borrowed + 1 WHERE id = $1',
      [member_id]
    );

    // Log analytics
    await client.query(
      `INSERT INTO analytics_log (event_type, book_id, member_id, metadata)
       VALUES ('book_borrowed', $1, $2, $3)`,
      [book_id, member_id, JSON.stringify({ issued_by: req.user.id, due_date: dueDate })]
    );

    await client.query('COMMIT');

    res.status(201).json({
      transaction: transResult.rows[0],
      message: `Book "${bookResult.rows[0].title}" issued successfully`
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Issue book error:', error);
    res.status(500).json({ error: 'Failed to issue book.' });
  } finally {
    client.release();
  }
});

// POST /api/transactions/return — Return a book
router.post('/return', authenticate, authorize('admin', 'librarian'), async (req, res) => {
  const client = await getClient();
  
  try {
    const { transaction_id } = req.body;

    if (!transaction_id) {
      return res.status(400).json({ error: 'Transaction ID is required.' });
    }

    await client.query('BEGIN');

    // Get transaction
    const transResult = await client.query(
      'SELECT * FROM transactions WHERE id = $1 AND status IN ($2, $3)',
      [transaction_id, 'Issued', 'Overdue']
    );
    if (transResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Active transaction not found.' });
    }

    const transaction = transResult.rows[0];
    const today = new Date();
    const dueDate = new Date(transaction.due_date);
    const isLate = today > dueDate;
    const daysLate = isLate ? Math.ceil((today - dueDate) / (1000 * 60 * 60 * 24)) : 0;
    const fineAmount = daysLate * 0.50; // $0.50 per day

    // Update transaction
    const status = isLate ? 'Returned Late' : 'Returned';
    await client.query(
      `UPDATE transactions SET return_date = CURRENT_DATE, fine_amount = $1, status = $2 WHERE id = $3`,
      [fineAmount, status, transaction_id]
    );

    // Update book copies
    await client.query(
      'UPDATE books SET copies_available = copies_available + 1 WHERE id = $1',
      [transaction.book_id]
    );

    // Update member
    await client.query(
      'UPDATE members SET books_borrowed = GREATEST(books_borrowed - 1, 0), total_fines = total_fines + $1 WHERE id = $2',
      [fineAmount, transaction.member_id]
    );

    // Log analytics
    await client.query(
      `INSERT INTO analytics_log (event_type, book_id, member_id, metadata)
       VALUES ('book_returned', $1, $2, $3)`,
      [transaction.book_id, transaction.member_id, JSON.stringify({ 
        days_late: daysLate, fine: fineAmount, returned_by: req.user.id 
      })]
    );

    await client.query('COMMIT');

    res.json({
      message: isLate 
        ? `Book returned late (${daysLate} days). Fine: $${fineAmount.toFixed(2)}` 
        : 'Book returned successfully. No fine.',
      fine: fineAmount,
      daysLate,
      status
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Return book error:', error);
    res.status(500).json({ error: 'Failed to return book.' });
  } finally {
    client.release();
  }
});

// GET /api/transactions/overdue — Get all overdue transactions
router.get('/overdue', authenticate, async (req, res) => {
  try {
    const result = await query(
      `SELECT t.*, b.title as book_title, b.author as book_author,
              u.name as member_name, u.email as member_email,
              CURRENT_DATE - t.due_date as days_overdue,
              (CURRENT_DATE - t.due_date) * 0.50 as estimated_fine
       FROM transactions t
       JOIN books b ON b.id = t.book_id
       JOIN members m ON m.id = t.member_id
       JOIN users u ON u.id = m.user_id
       WHERE t.status = 'Issued' AND t.due_date < CURRENT_DATE
       ORDER BY t.due_date ASC`
    );

    // Update overdue status
    await query(
      `UPDATE transactions SET status = 'Overdue' WHERE status = 'Issued' AND due_date < CURRENT_DATE`
    );

    res.json({ overdue: result.rows, count: result.rows.length });
  } catch (error) {
    console.error('Overdue error:', error);
    res.status(500).json({ error: 'Failed to fetch overdue transactions.' });
  }
});

module.exports = router;
