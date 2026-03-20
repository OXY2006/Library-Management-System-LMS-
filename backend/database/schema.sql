-- =====================================================
-- LibraryAI Database Schema
-- AI-Powered Library Management System
-- =====================================================

-- Drop existing tables (in reverse dependency order)
DROP TABLE IF EXISTS analytics_log CASCADE;
DROP TABLE IF EXISTS recommendations CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS members CASCADE;
DROP TABLE IF EXISTS books CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- =====================================================
-- USERS TABLE
-- =====================================================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'librarian', 'member')),
    avatar_url VARCHAR(500),
    bio TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- =====================================================
-- BOOKS TABLE
-- =====================================================
CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    isbn VARCHAR(20) UNIQUE NOT NULL,
    title VARCHAR(500) NOT NULL,
    author VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    publisher VARCHAR(255),
    published_year INTEGER,
    pages INTEGER,
    cover_url VARCHAR(500),
    copies_total INTEGER NOT NULL DEFAULT 1,
    copies_available INTEGER NOT NULL DEFAULT 1,
    status VARCHAR(50) GENERATED ALWAYS AS (
        CASE
            WHEN copies_available = 0 THEN 'Unavailable'
            WHEN copies_available <= 1 THEN 'Low Stock'
            ELSE 'Available'
        END
    ) STORED,
    total_borrows INTEGER DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_books_isbn ON books(isbn);
CREATE INDEX idx_books_title ON books(title);
CREATE INDEX idx_books_author ON books(author);
CREATE INDEX idx_books_category ON books(category);
CREATE INDEX idx_books_status ON books((CASE WHEN copies_available = 0 THEN 'Unavailable' WHEN copies_available <= 1 THEN 'Low Stock' ELSE 'Available' END));

-- =====================================================
-- MEMBERS TABLE
-- =====================================================
CREATE TABLE members (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    membership_type VARCHAR(50) NOT NULL DEFAULT 'standard' CHECK (membership_type IN ('standard', 'premium', 'student', 'faculty')),
    max_books INTEGER NOT NULL DEFAULT 5,
    books_borrowed INTEGER DEFAULT 0,
    total_fines DECIMAL(10,2) DEFAULT 0.00,
    validity_start DATE NOT NULL DEFAULT CURRENT_DATE,
    validity_end DATE NOT NULL DEFAULT (CURRENT_DATE + INTERVAL '1 year'),
    status VARCHAR(50) NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Suspended')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_members_user_id ON members(user_id);
CREATE INDEX idx_members_status ON members(status);

-- =====================================================
-- TRANSACTIONS TABLE (Issue / Return)
-- =====================================================
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    book_id INTEGER NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    member_id INTEGER NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL DEFAULT (CURRENT_DATE + INTERVAL '14 days'),
    return_date DATE,
    fine_amount DECIMAL(10,2) DEFAULT 0.00,
    fine_paid BOOLEAN DEFAULT false,
    status VARCHAR(50) NOT NULL DEFAULT 'Issued' CHECK (status IN ('Issued', 'Returned', 'Returned Late', 'Overdue', 'Lost')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_transactions_book ON transactions(book_id);
CREATE INDEX idx_transactions_member ON transactions(member_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_due_date ON transactions(due_date);

-- =====================================================
-- REVIEWS TABLE
-- =====================================================
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    book_id INTEGER NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    sentiment VARCHAR(50) DEFAULT 'Neutral' CHECK (sentiment IN ('Positive', 'Neutral', 'Negative')),
    helpful_count INTEGER DEFAULT 0,
    is_flagged BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(book_id, user_id)
);

CREATE INDEX idx_reviews_book ON reviews(book_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);

-- =====================================================
-- RECOMMENDATIONS TABLE
-- =====================================================
CREATE TABLE recommendations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    book_id INTEGER NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    score DECIMAL(5,2) NOT NULL,
    algorithm_type VARCHAR(50) NOT NULL CHECK (algorithm_type IN ('content-based', 'collaborative', 'popularity', 'hybrid')),
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_recommendations_user ON recommendations(user_id);
CREATE INDEX idx_recommendations_score ON recommendations(score DESC);

-- =====================================================
-- ANALYTICS LOG TABLE
-- =====================================================
CREATE TABLE analytics_log (
    id SERIAL PRIMARY KEY,
    event_type VARCHAR(100) NOT NULL,
    book_id INTEGER REFERENCES books(id) ON DELETE SET NULL,
    member_id INTEGER REFERENCES members(id) ON DELETE SET NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_analytics_event ON analytics_log(event_type);
CREATE INDEX idx_analytics_created ON analytics_log(created_at);
CREATE INDEX idx_analytics_book ON analytics_log(book_id);

-- =====================================================
-- TRIGGER: Auto-update updated_at timestamp
-- =====================================================
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_timestamp BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER update_books_timestamp BEFORE UPDATE ON books FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER update_members_timestamp BEFORE UPDATE ON members FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER update_transactions_timestamp BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER update_reviews_timestamp BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- =====================================================
-- TRIGGER: Update book average_rating on review insert/update
-- =====================================================
CREATE OR REPLACE FUNCTION update_book_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE books SET average_rating = (
        SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE book_id = COALESCE(NEW.book_id, OLD.book_id)
    ) WHERE id = COALESCE(NEW.book_id, OLD.book_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_rating_on_review
    AFTER INSERT OR UPDATE OR DELETE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_book_rating();
