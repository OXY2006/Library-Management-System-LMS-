const express = require('express');
const { query } = require('../config/db');
const { authenticate, authorize, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/books — List all books with search and filters
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { search, category, status, sort = 'title', order = 'asc', page = 1, limit = 20 } = req.query;
    
    let whereClause = 'WHERE 1=1';
    const params = [];
    let paramCount = 0;

    if (search) {
      paramCount++;
      whereClause += ` AND (title ILIKE $${paramCount} OR author ILIKE $${paramCount} OR isbn ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    if (category) {
      paramCount++;
      whereClause += ` AND category = $${paramCount}`;
      params.push(category);
    }

    if (status) {
      paramCount++;
      whereClause += ` AND status = $${paramCount}`;
      params.push(status);
    }

    const validSorts = ['title', 'author', 'category', 'total_borrows', 'average_rating', 'created_at'];
    const sortColumn = validSorts.includes(sort) ? sort : 'title';
    const sortOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Get total count
    const countResult = await query(`SELECT COUNT(*) FROM books ${whereClause}`, params);
    const total = parseInt(countResult.rows[0].count);

    // Get books
    const result = await query(
      `SELECT id, isbn, title, author, category, description, publisher, published_year,
              pages, cover_url, copies_total, copies_available, status, total_borrows,
              average_rating, created_at
       FROM books ${whereClause}
       ORDER BY ${sortColumn} ${sortOrder}
       LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`,
      [...params, parseInt(limit), offset]
    );

    res.json({
      books: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('List books error:', error);
    res.status(500).json({ error: 'Failed to fetch books.' });
  }
});

// GET /api/books/categories — Get all categories
router.get('/categories', async (req, res) => {
  try {
    const result = await query(
      'SELECT DISTINCT category, COUNT(*) as count FROM books GROUP BY category ORDER BY count DESC'
    );
    res.json({ categories: result.rows });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories.' });
  }
});

// GET /api/books/:id — Get single book with reviews
router.get('/:id', async (req, res) => {
  try {
    const bookResult = await query(
      `SELECT b.*, 
              COUNT(r.id) as review_count,
              COALESCE(AVG(r.rating), 0) as avg_rating
       FROM books b
       LEFT JOIN reviews r ON r.book_id = b.id
       WHERE b.id = $1
       GROUP BY b.id`,
      [req.params.id]
    );

    if (bookResult.rows.length === 0) {
      return res.status(404).json({ error: 'Book not found.' });
    }

    // Get recent reviews
    const reviewsResult = await query(
      `SELECT r.*, u.name as user_name
       FROM reviews r
       JOIN users u ON u.id = r.user_id
       WHERE r.book_id = $1
       ORDER BY r.helpful_count DESC, r.created_at DESC
       LIMIT 5`,
      [req.params.id]
    );

    res.json({
      book: bookResult.rows[0],
      reviews: reviewsResult.rows
    });
  } catch (error) {
    console.error('Get book error:', error);
    res.status(500).json({ error: 'Failed to fetch book.' });
  }
});

// POST /api/books — Create new book (admin/librarian)
router.post('/', authenticate, authorize('admin', 'librarian'), async (req, res) => {
  try {
    const { isbn, title, author, category, description, publisher, published_year, pages, cover_url, copies_total } = req.body;

    if (!isbn || !title || !author || !category) {
      return res.status(400).json({ error: 'ISBN, title, author, and category are required.' });
    }

    // Check duplicate ISBN
    const existing = await query('SELECT id FROM books WHERE isbn = $1', [isbn]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'A book with this ISBN already exists.' });
    }

    const result = await query(
      `INSERT INTO books (isbn, title, author, category, description, publisher, published_year, pages, cover_url, copies_total, copies_available)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $10)
       RETURNING *`,
      [isbn, title, author, category, description, publisher, published_year, pages, cover_url, copies_total || 1]
    );

    // Log event
    await query(
      `INSERT INTO analytics_log (event_type, book_id, metadata)
       VALUES ('book_added', $1, $2)`,
      [result.rows[0].id, JSON.stringify({ added_by: req.user.id })]
    );

    res.status(201).json({ book: result.rows[0], message: 'Book added successfully' });
  } catch (error) {
    console.error('Create book error:', error);
    res.status(500).json({ error: 'Failed to create book.' });
  }
});

// PUT /api/books/:id — Update book (admin/librarian)
router.put('/:id', authenticate, authorize('admin', 'librarian'), async (req, res) => {
  try {
    const { isbn, title, author, category, description, publisher, published_year, pages, cover_url, copies_total, copies_available } = req.body;

    const result = await query(
      `UPDATE books SET
        isbn = COALESCE($1, isbn),
        title = COALESCE($2, title),
        author = COALESCE($3, author),
        category = COALESCE($4, category),
        description = COALESCE($5, description),
        publisher = COALESCE($6, publisher),
        published_year = COALESCE($7, published_year),
        pages = COALESCE($8, pages),
        cover_url = COALESCE($9, cover_url),
        copies_total = COALESCE($10, copies_total),
        copies_available = COALESCE($11, copies_available)
       WHERE id = $12
       RETURNING *`,
      [isbn, title, author, category, description, publisher, published_year, pages, cover_url, copies_total, copies_available, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Book not found.' });
    }

    res.json({ book: result.rows[0], message: 'Book updated successfully' });
  } catch (error) {
    console.error('Update book error:', error);
    res.status(500).json({ error: 'Failed to update book.' });
  }
});

// DELETE /api/books/:id — Delete book (admin only)
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const result = await query('DELETE FROM books WHERE id = $1 RETURNING id, title', [req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Book not found.' });
    }

    res.json({ message: `Book "${result.rows[0].title}" deleted successfully` });
  } catch (error) {
    console.error('Delete book error:', error);
    res.status(500).json({ error: 'Failed to delete book.' });
  }
});

module.exports = router;
