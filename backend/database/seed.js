const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');

async function seedDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('🌱 Seeding database with sample data...\n');
    
    await client.query('BEGIN');

    // ===== USERS =====
    const passwordHash = await bcrypt.hash('password123', 10);
    
    const usersResult = await client.query(`
      INSERT INTO users (name, email, password_hash, role, bio) VALUES
        ('Alice Johnson', 'alice@libraryai.com', $1, 'admin', 'Library administrator with 10+ years of experience. Passionate about digital transformation in libraries.'),
        ('Bob Smith', 'bob@example.com', $1, 'member', 'Avid reader and software developer. Loves technology and fiction books.'),
        ('Carol Davis', 'carol@libraryai.com', $1, 'librarian', 'Senior librarian specializing in digital collections and reader engagement.'),
        ('David Wilson', 'david@example.com', $1, 'member', 'Computer science student with a passion for algorithms and data structures.'),
        ('Eva Martinez', 'eva@example.com', $1, 'member', 'Literature professor and book club organizer.'),
        ('Frank Brown', 'frank@example.com', $1, 'member', 'Retired engineer who loves reading about history and science.'),
        ('Grace Lee', 'grace@libraryai.com', $1, 'librarian', 'Youth services librarian focused on promoting reading among young adults.'),
        ('Henry Kim', 'henry@example.com', $1, 'member', 'Graduate student researching AI and machine learning applications.'),
        ('Iris Patel', 'iris@example.com', $1, 'member', 'High school teacher who incorporates diverse books in her curriculum.'),
        ('Jack Turner', 'jack@example.com', $1, 'member', 'Freelance writer and voracious reader of mystery and thriller genres.')
      RETURNING id
    `, [passwordHash]);
    
    const userIds = usersResult.rows.map(r => r.id);
    console.log(`  ✅ Created ${userIds.length} users`);

    // ===== MEMBERS =====
    const membersResult = await client.query(`
      INSERT INTO members (user_id, membership_type, max_books, books_borrowed, validity_start, validity_end, status) VALUES
        ($1, 'premium', 10, 3, '2024-01-15', '2025-01-15', 'Active'),
        ($2, 'standard', 5, 5, '2024-02-20', '2025-02-20', 'Active'),
        ($3, 'premium', 10, 0, '2024-03-10', '2025-03-10', 'Active'),
        ($4, 'student', 7, 7, '2024-04-05', '2025-04-05', 'Active'),
        ($5, 'faculty', 15, 2, '2024-01-22', '2024-07-22', 'Inactive'),
        ($6, 'standard', 5, 4, '2024-05-18', '2025-05-18', 'Active'),
        ($7, 'premium', 10, 1, '2024-06-12', '2025-06-12', 'Active'),
        ($8, 'student', 7, 6, '2024-07-01', '2025-07-01', 'Active'),
        ($9, 'faculty', 15, 3, '2024-08-15', '2025-08-15', 'Active'),
        ($10, 'standard', 5, 2, '2024-09-01', '2025-09-01', 'Active')
      RETURNING id
    `, userIds);
    
    const memberIds = membersResult.rows.map(r => r.id);
    console.log(`  ✅ Created ${memberIds.length} members`);

    // ===== BOOKS =====
    const booksResult = await client.query(`
      INSERT INTO books (isbn, title, author, category, description, publisher, published_year, pages, cover_url, copies_total, copies_available, total_borrows) VALUES
        ('978-0-13-468599-1', 'The Pragmatic Programmer', 'David Thomas & Andrew Hunt', 'Technology', 'A guide to becoming a better software developer through pragmatic thinking and practical advice.', 'Addison-Wesley', 2019, 352, 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=200&h=300&fit=crop', 5, 3, 142),
        ('978-0-06-112008-4', 'To Kill a Mockingbird', 'Harper Lee', 'Fiction', 'A classic novel about racial injustice in the American South through the eyes of a young girl.', 'HarperCollins', 1960, 281, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200&h=300&fit=crop', 8, 2, 289),
        ('978-0-7432-7356-5', '1984', 'George Orwell', 'Fiction', 'A dystopian novel about a totalitarian society under constant surveillance.', 'Signet Classic', 1949, 328, 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=200&h=300&fit=crop', 6, 0, 312),
        ('978-0-596-51774-8', 'JavaScript: The Good Parts', 'Douglas Crockford', 'Technology', 'A deep dive into the most reliable and elegant features of JavaScript.', 'O''Reilly Media', 2008, 176, 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=200&h=300&fit=crop', 4, 1, 98),
        ('978-0-14-028329-7', 'The Great Gatsby', 'F. Scott Fitzgerald', 'Fiction', 'A tale of wealth, love, and the American Dream set in the Jazz Age.', 'Scribner', 1925, 180, 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=200&h=300&fit=crop', 10, 7, 201),
        ('978-0-201-63361-0', 'Design Patterns', 'Gang of Four', 'Technology', 'The definitive guide to software design patterns and object-oriented design principles.', 'Addison-Wesley', 1994, 395, 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=200&h=300&fit=crop', 3, 0, 156),
        ('978-0-06-093546-7', 'Brave New World', 'Aldous Huxley', 'Classic', 'A dystopian vision of a future society driven by technology and hedonism.', 'Harper Perennial', 1932, 311, 'https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=200&h=300&fit=crop', 5, 4, 178),
        ('978-0-13-235088-4', 'Clean Code', 'Robert C. Martin', 'Technology', 'A handbook of agile software craftsmanship focusing on writing readable, maintainable code.', 'Prentice Hall', 2008, 464, 'https://images.unsplash.com/photo-1550399105-c4db5fb85c18?w=200&h=300&fit=crop', 6, 2, 234),
        ('978-0-14-118776-1', 'Sapiens', 'Yuval Noah Harari', 'Non-Fiction', 'A brief history of humankind exploring how Homo sapiens came to dominate the world.', 'Harper', 2015, 443, 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=200&h=300&fit=crop', 7, 5, 267),
        ('978-0-13-110362-7', 'The C Programming Language', 'Brian Kernighan & Dennis Ritchie', 'Technology', 'The authoritative reference manual for C programming language by its creators.', 'Prentice Hall', 1988, 272, 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=200&h=300&fit=crop', 3, 1, 189),
        ('978-0-316-76948-0', 'The Catcher in the Rye', 'J.D. Salinger', 'Fiction', 'A classic coming-of-age novel about teenage alienation and loss of innocence.', 'Little, Brown', 1951, 234, 'https://images.unsplash.com/photo-1491841573634-28140fc7bd5a?w=200&h=300&fit=crop', 4, 3, 156),
        ('978-0-553-21311-7', 'Pride and Prejudice', 'Jane Austen', 'Classic', 'A romantic novel about manners, education, marriage, and moral values in Regency-era England.', 'Modern Library', 1813, 432, 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=200&h=300&fit=crop', 6, 4, 198),
        ('978-0-06-112241-5', 'Thinking, Fast and Slow', 'Daniel Kahneman', 'Non-Fiction', 'An exploration of the two systems that drive the way we think and make decisions.', 'Farrar, Straus', 2011, 499, 'https://images.unsplash.com/photo-1535905557558-afc4877a26fc?w=200&h=300&fit=crop', 5, 3, 145),
        ('978-0-307-47427-9', 'The Lean Startup', 'Eric Ries', 'Non-Fiction', 'A methodology for developing businesses and products through validated learning.', 'Crown Business', 2011, 336, 'https://images.unsplash.com/photo-1553729459-afe8f2e2ed65?w=200&h=300&fit=crop', 4, 2, 123),
        ('978-0-06-093546-1', 'Atomic Habits', 'James Clear', 'Non-Fiction', 'An easy and proven way to build good habits and break bad ones.', 'Avery', 2018, 320, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=300&fit=crop', 8, 5, 356),
        ('978-0-262-03384-8', 'Introduction to Algorithms', 'Thomas Cormen', 'Technology', 'The comprehensive textbook on algorithms widely used in universities worldwide.', 'MIT Press', 2009, 1312, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=300&fit=crop', 4, 1, 210),
        ('978-0-14-028329-8', 'Dune', 'Frank Herbert', 'Fiction', 'An epic science fiction novel about politics, religion, and ecology on a desert planet.', 'Ace Books', 1965, 688, 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&h=300&fit=crop', 5, 3, 187),
        ('978-0-06-093546-2', 'Educated', 'Tara Westover', 'Non-Fiction', 'A memoir about a woman who grew up in a survivalist family and went on to earn a PhD from Cambridge.', 'Random House', 2018, 352, 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=300&fit=crop', 6, 4, 234),
        ('978-0-13-235088-5', 'Refactoring', 'Martin Fowler', 'Technology', 'The definitive guide to improving the design of existing code.', 'Addison-Wesley', 2018, 448, 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=200&h=300&fit=crop', 3, 2, 134),
        ('978-0-14-118776-2', 'Homo Deus', 'Yuval Noah Harari', 'Non-Fiction', 'A brief history of tomorrow exploring where humankind is headed.', 'Harper', 2017, 449, 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=200&h=300&fit=crop', 5, 3, 198)
      RETURNING id
    `);
    
    const bookIds = booksResult.rows.map(r => r.id);
    console.log(`  ✅ Created ${bookIds.length} books`);

    // ===== TRANSACTIONS =====
    await client.query(`
      INSERT INTO transactions (book_id, member_id, issue_date, due_date, return_date, fine_amount, status) VALUES
        ($1, $2, '2024-11-01', '2024-11-15', NULL, 0, 'Issued'),
        ($3, $4, '2024-10-20', '2024-11-03', '2024-11-05', 2.00, 'Returned Late'),
        ($5, $6, '2024-11-05', '2024-11-19', NULL, 0, 'Issued'),
        ($7, $8, '2024-10-15', '2024-10-29', '2024-10-28', 0, 'Returned'),
        ($9, $10, '2024-10-25', '2024-11-08', NULL, 4.50, 'Overdue'),
        ($11, $12, '2024-09-10', '2024-09-24', '2024-09-30', 3.00, 'Returned Late'),
        ($13, $14, '2024-11-10', '2024-11-24', NULL, 0, 'Issued'),
        ($15, $16, '2024-11-08', '2024-11-22', NULL, 0, 'Issued'),
        ($17, $18, '2024-11-12', '2024-11-26', NULL, 0, 'Issued'),
        ($19, $20, '2024-10-05', '2024-10-19', '2024-10-18', 0, 'Returned')
    `, [
      bookIds[7], memberIds[1],   // Clean Code to Bob
      bookIds[2], memberIds[3],   // 1984 to David
      bookIds[8], memberIds[0],   // Sapiens to Alice
      bookIds[4], memberIds[5],   // Great Gatsby to Frank
      bookIds[5], memberIds[7],   // Design Patterns to Henry
      bookIds[0], memberIds[4],   // Pragmatic Programmer to Eva
      bookIds[3], memberIds[6],   // JS Good Parts to Grace
      bookIds[11], memberIds[1],  // Pride & Prejudice to Bob
      bookIds[16], memberIds[8],  // Dune to Iris
      bookIds[18], memberIds[9],  // Refactoring to Jack
    ]);
    console.log('  ✅ Created 10 transactions');

    // ===== REVIEWS =====
    await client.query(`
      INSERT INTO reviews (book_id, user_id, rating, comment, sentiment, helpful_count) VALUES
        ($1, $2, 5, 'This book completely changed the way I write code. Every developer should read this masterpiece. The principles are timeless and applicable to any programming language.', 'Positive', 42),
        ($3, $4, 5, 'A timeless classic that feels more relevant than ever. Orwell''s vision is hauntingly prescient. The world-building is incredible.', 'Positive', 38),
        ($5, $6, 4, 'Fascinating overview of human history. Some parts feel oversimplified but overall a great and thought-provoking read.', 'Positive', 25),
        ($7, $8, 5, 'Essential reading for any software engineer. The tips are practical, timeless, and immediately applicable to daily work.', 'Positive', 31),
        ($9, $10, 3, 'Good content but feels a bit dated now. Would love an updated edition covering modern JavaScript patterns.', 'Neutral', 12),
        ($11, $12, 4, 'Beautifully written prose. Fitzgerald captures the essence of the American Dream and its inherent contradictions.', 'Positive', 19),
        ($13, $14, 5, 'One of the best non-fiction books I have ever read. Clear''s framework for habit building is incredibly practical.', 'Positive', 55),
        ($15, $16, 4, 'Dense but rewarding. The design patterns in this book are foundational to modern software engineering.', 'Positive', 28),
        ($17, $18, 5, 'A thought-provoking masterpiece. Harari makes complex topics accessible and engaging.', 'Positive', 33),
        ($19, $20, 4, 'An inspiring memoir about the power of education. Westover''s story is both heartbreaking and uplifting.', 'Positive', 22)
    `, [
      bookIds[7], userIds[1],     // Clean Code by Bob
      bookIds[2], userIds[3],     // 1984 by David
      bookIds[8], userIds[0],     // Sapiens by Alice
      bookIds[0], userIds[7],     // Pragmatic Programmer by Henry
      bookIds[3], userIds[6],     // JS Good Parts by Grace
      bookIds[4], userIds[5],     // Great Gatsby by Frank
      bookIds[14], userIds[8],    // Atomic Habits by Iris
      bookIds[5], userIds[3],     // Design Patterns by David
      bookIds[19], userIds[4],    // Homo Deus by Eva
      bookIds[17], userIds[9],    // Educated by Jack
    ]);
    console.log('  ✅ Created 10 reviews');

    // ===== RECOMMENDATIONS =====
    await client.query(`
      INSERT INTO recommendations (user_id, book_id, score, algorithm_type, reason) VALUES
        ($1, $2, 95.5, 'content-based', 'Based on your interest in technology books'),
        ($1, $3, 89.2, 'collaborative', 'Similar readers also enjoyed this'),
        ($1, $4, 87.8, 'popularity', 'Trending in your category'),
        ($5, $6, 92.1, 'content-based', 'Matches your reading history'),
        ($5, $7, 85.5, 'collaborative', 'Highly rated by similar profiles'),
        ($8, $9, 91.3, 'content-based', 'Complements your recent readings'),
        ($8, $10, 78.9, 'collaborative', 'Popular among your peers'),
        ($11, $12, 88.7, 'hybrid', 'AI-selected recommendation')
    `, [
      userIds[1], bookIds[7], bookIds[0], bookIds[8],  // For Bob
      userIds[3], bookIds[15], bookIds[14],             // For David
      userIds[7], bookIds[18], bookIds[12],             // For Henry
      userIds[0], bookIds[16],                          // For Alice
    ]);
    console.log('  ✅ Created 8 recommendations');

    // ===== ANALYTICS EVENTS =====
    const events = [];
    const eventTypes = ['book_borrowed', 'book_returned', 'book_searched', 'member_login', 'review_posted'];
    for (let i = 0; i < 50; i++) {
      const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      const bookId = bookIds[Math.floor(Math.random() * bookIds.length)];
      const memberId = memberIds[Math.floor(Math.random() * memberIds.length)];
      const daysAgo = Math.floor(Math.random() * 90);
      events.push(`($1, ${bookId}, ${memberId}, NOW() - INTERVAL '${daysAgo} days')`);
    }
    
    for (const eventType of eventTypes) {
      await client.query(`
        INSERT INTO analytics_log (event_type, book_id, member_id, created_at)
        SELECT '${eventType}', 
          (SELECT id FROM books ORDER BY RANDOM() LIMIT 1),
          (SELECT id FROM members ORDER BY RANDOM() LIMIT 1),
          NOW() - (RANDOM() * INTERVAL '90 days')
        FROM generate_series(1, 10)
      `);
    }
    console.log('  ✅ Created 50 analytics events');

    await client.query('COMMIT');
    
    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📋 Test Credentials:');
    console.log('  Admin:     alice@libraryai.com / password123');
    console.log('  Librarian: carol@libraryai.com / password123');
    console.log('  Member:    bob@example.com / password123');
    
    process.exit(0);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Seeding failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    client.release();
  }
}

seedDatabase();
