const express = require('express');
const { query } = require('../config/db');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// GET /api/members — List all members
router.get('/', authenticate, async (req, res) => {
  try {
    const { search, status, type, page = 1, limit = 20 } = req.query;
    
    let whereClause = 'WHERE 1=1';
    const params = [];
    let paramCount = 0;

    if (search) {
      paramCount++;
      whereClause += ` AND (u.name ILIKE $${paramCount} OR u.email ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }
    if (status) {
      paramCount++;
      whereClause += ` AND m.status = $${paramCount}`;
      params.push(status);
    }
    if (type) {
      paramCount++;
      whereClause += ` AND m.membership_type = $${paramCount}`;
      params.push(type);
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const result = await query(
      `SELECT m.*, u.name, u.email, u.role, u.avatar_url
       FROM members m
       JOIN users u ON u.id = m.user_id
       ${whereClause}
       ORDER BY m.created_at DESC
       LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`,
      [...params, parseInt(limit), offset]
    );

    const countResult = await query(
      `SELECT COUNT(*) FROM members m JOIN users u ON u.id = m.user_id ${whereClause}`,
      params
    );

    res.json({
      members: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(countResult.rows[0].count),
        pages: Math.ceil(parseInt(countResult.rows[0].count) / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('List members error:', error);
    res.status(500).json({ error: 'Failed to fetch members.' });
  }
});

// GET /api/members/:id — Get single member with borrowing history
router.get('/:id', authenticate, async (req, res) => {
  try {
    const memberResult = await query(
      `SELECT m.*, u.name, u.email, u.role, u.avatar_url, u.bio
       FROM members m
       JOIN users u ON u.id = m.user_id
       WHERE m.id = $1`,
      [req.params.id]
    );

    if (memberResult.rows.length === 0) {
      return res.status(404).json({ error: 'Member not found.' });
    }

    const historyResult = await query(
      `SELECT t.*, b.title as book_title, b.author as book_author, b.isbn
       FROM transactions t
       JOIN books b ON b.id = t.book_id
       WHERE t.member_id = $1
       ORDER BY t.issue_date DESC
       LIMIT 20`,
      [req.params.id]
    );

    res.json({
      member: memberResult.rows[0],
      borrowingHistory: historyResult.rows
    });
  } catch (error) {
    console.error('Get member error:', error);
    res.status(500).json({ error: 'Failed to fetch member.' });
  }
});

// PUT /api/members/:id — Update member (admin/librarian)
router.put('/:id', authenticate, authorize('admin', 'librarian'), async (req, res) => {
  try {
    const { membership_type, max_books, status } = req.body;

    const result = await query(
      `UPDATE members SET
        membership_type = COALESCE($1, membership_type),
        max_books = COALESCE($2, max_books),
        status = COALESCE($3, status)
       WHERE id = $4
       RETURNING *`,
      [membership_type, max_books, status, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Member not found.' });
    }

    res.json({ member: result.rows[0], message: 'Member updated successfully' });
  } catch (error) {
    console.error('Update member error:', error);
    res.status(500).json({ error: 'Failed to update member.' });
  }
});

// DELETE /api/members/:id — Deactivate member (admin)
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    await query(`UPDATE members SET status = 'Inactive' WHERE id = $1`, [req.params.id]);
    await query(`UPDATE users SET is_active = false WHERE id = (SELECT user_id FROM members WHERE id = $1)`, [req.params.id]);

    res.json({ message: 'Member deactivated successfully' });
  } catch (error) {
    console.error('Delete member error:', error);
    res.status(500).json({ error: 'Failed to deactivate member.' });
  }
});

module.exports = router;
