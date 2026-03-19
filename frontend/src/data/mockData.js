// Mock data for the Library Management System

export const books = [
  { id: 1, isbn: '978-0-13-468599-1', title: 'The Pragmatic Programmer', author: 'David Thomas', category: 'Technology', copies_total: 5, copies_available: 3, status: 'Available', cover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=200&h=300&fit=crop', rating: 4.8, borrowCount: 142 },
  { id: 2, isbn: '978-0-06-112008-4', title: 'To Kill a Mockingbird', author: 'Harper Lee', category: 'Fiction', copies_total: 8, copies_available: 2, status: 'Available', cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200&h=300&fit=crop', rating: 4.9, borrowCount: 289 },
  { id: 3, isbn: '978-0-7432-7356-5', title: '1984', author: 'George Orwell', category: 'Fiction', copies_total: 6, copies_available: 0, status: 'Unavailable', cover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=200&h=300&fit=crop', rating: 4.7, borrowCount: 312 },
  { id: 4, isbn: '978-0-596-51774-8', title: 'JavaScript: The Good Parts', author: 'Douglas Crockford', category: 'Technology', copies_total: 4, copies_available: 1, status: 'Low Stock', cover: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=200&h=300&fit=crop', rating: 4.3, borrowCount: 98 },
  { id: 5, isbn: '978-0-14-028329-7', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', category: 'Fiction', copies_total: 10, copies_available: 7, status: 'Available', cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=200&h=300&fit=crop', rating: 4.5, borrowCount: 201 },
  { id: 6, isbn: '978-0-201-63361-0', title: 'Design Patterns', author: 'Gang of Four', category: 'Technology', copies_total: 3, copies_available: 0, status: 'Unavailable', cover: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=200&h=300&fit=crop', rating: 4.6, borrowCount: 156 },
  { id: 7, isbn: '978-0-06-093546-7', title: 'To Kill a Mockingbird', author: 'Harper Lee', category: 'Classic', copies_total: 5, copies_available: 4, status: 'Available', cover: 'https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=200&h=300&fit=crop', rating: 4.4, borrowCount: 178 },
  { id: 8, isbn: '978-0-13-235088-4', title: 'Clean Code', author: 'Robert C. Martin', category: 'Technology', copies_total: 6, copies_available: 2, status: 'Available', cover: 'https://images.unsplash.com/photo-1550399105-c4db5fb85c18?w=200&h=300&fit=crop', rating: 4.7, borrowCount: 234 },
  { id: 9, isbn: '978-0-14-118776-1', title: 'Sapiens', author: 'Yuval Noah Harari', category: 'Non-Fiction', copies_total: 7, copies_available: 5, status: 'Available', cover: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=200&h=300&fit=crop', rating: 4.6, borrowCount: 267 },
  { id: 10, isbn: '978-0-13-110362-7', title: 'The C Programming Language', author: 'Kernighan & Ritchie', category: 'Technology', copies_total: 3, copies_available: 1, status: 'Low Stock', cover: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=200&h=300&fit=crop', rating: 4.5, borrowCount: 189 },
  { id: 11, isbn: '978-0-316-76948-0', title: 'The Catcher in the Rye', author: 'J.D. Salinger', category: 'Fiction', copies_total: 4, copies_available: 3, status: 'Available', cover: 'https://images.unsplash.com/photo-1491841573634-28140fc7bd5a?w=200&h=300&fit=crop', rating: 4.2, borrowCount: 156 },
  { id: 12, isbn: '978-0-553-21311-7', title: 'Pride and Prejudice', author: 'Jane Austen', category: 'Classic', copies_total: 6, copies_available: 4, status: 'Available', cover: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=200&h=300&fit=crop', rating: 4.8, borrowCount: 198 },
];

export const members = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', type: 'Admin', booksBorrowed: 3, status: 'Active', joinDate: '2024-01-15', validUntil: '2025-01-15', avatar: 'AJ' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', type: 'Member', booksBorrowed: 5, status: 'Active', joinDate: '2024-02-20', validUntil: '2025-02-20', avatar: 'BS' },
  { id: 3, name: 'Carol Davis', email: 'carol@example.com', type: 'Librarian', booksBorrowed: 0, status: 'Active', joinDate: '2024-03-10', validUntil: '2025-03-10', avatar: 'CD' },
  { id: 4, name: 'David Wilson', email: 'david@example.com', type: 'Member', booksBorrowed: 7, status: 'Active', joinDate: '2024-04-05', validUntil: '2025-04-05', avatar: 'DW' },
  { id: 5, name: 'Eva Martinez', email: 'eva@example.com', type: 'Member', booksBorrowed: 2, status: 'Inactive', joinDate: '2024-01-22', validUntil: '2024-07-22', avatar: 'EM' },
  { id: 6, name: 'Frank Brown', email: 'frank@example.com', type: 'Member', booksBorrowed: 4, status: 'Active', joinDate: '2024-05-18', validUntil: '2025-05-18', avatar: 'FB' },
  { id: 7, name: 'Grace Lee', email: 'grace@example.com', type: 'Librarian', booksBorrowed: 1, status: 'Active', joinDate: '2024-06-12', validUntil: '2025-06-12', avatar: 'GL' },
  { id: 8, name: 'Henry Kim', email: 'henry@example.com', type: 'Member', booksBorrowed: 6, status: 'Active', joinDate: '2024-07-01', validUntil: '2025-07-01', avatar: 'HK' },
];

export const transactions = [
  { id: 1, bookTitle: 'Clean Code', memberName: 'Bob Smith', issueDate: '2024-11-01', dueDate: '2024-11-15', returnDate: null, status: 'Issued', fine: 0 },
  { id: 2, bookTitle: '1984', memberName: 'David Wilson', issueDate: '2024-10-20', dueDate: '2024-11-03', returnDate: '2024-11-05', status: 'Returned Late', fine: 2.00 },
  { id: 3, bookTitle: 'Sapiens', memberName: 'Alice Johnson', issueDate: '2024-11-05', dueDate: '2024-11-19', returnDate: null, status: 'Issued', fine: 0 },
  { id: 4, bookTitle: 'The Great Gatsby', memberName: 'Frank Brown', issueDate: '2024-10-15', dueDate: '2024-10-29', returnDate: '2024-10-28', status: 'Returned', fine: 0 },
  { id: 5, bookTitle: 'Design Patterns', memberName: 'Henry Kim', issueDate: '2024-10-25', dueDate: '2024-11-08', returnDate: null, status: 'Overdue', fine: 4.50 },
  { id: 6, bookTitle: 'The Pragmatic Programmer', memberName: 'Eva Martinez', issueDate: '2024-09-10', dueDate: '2024-09-24', returnDate: '2024-09-30', status: 'Returned Late', fine: 3.00 },
  { id: 7, bookTitle: 'JavaScript: The Good Parts', memberName: 'Grace Lee', issueDate: '2024-11-10', dueDate: '2024-11-24', returnDate: null, status: 'Issued', fine: 0 },
  { id: 8, bookTitle: 'Pride and Prejudice', memberName: 'Bob Smith', issueDate: '2024-11-08', dueDate: '2024-11-22', returnDate: null, status: 'Issued', fine: 0 },
];

export const reviews = [
  { id: 1, bookId: 8, bookTitle: 'Clean Code', userName: 'Bob Smith', rating: 5, comment: 'This book completely changed the way I write code. Every developer should read this masterpiece.', sentiment: 'Positive', helpful: 42, date: '2024-10-15' },
  { id: 2, bookId: 3, bookTitle: '1984', userName: 'David Wilson', rating: 5, comment: 'A timeless classic that feels more relevant than ever. Orwell\'s vision is hauntingly prescient.', sentiment: 'Positive', helpful: 38, date: '2024-10-20' },
  { id: 3, bookId: 9, bookTitle: 'Sapiens', userName: 'Alice Johnson', rating: 4, comment: 'Fascinating overview of human history. Some parts feel oversimplified but overall a great read.', sentiment: 'Positive', helpful: 25, date: '2024-10-25' },
  { id: 4, bookId: 1, bookTitle: 'The Pragmatic Programmer', userName: 'Henry Kim', rating: 5, comment: 'Essential reading for any software engineer. The tips are practical and timeless.', sentiment: 'Positive', helpful: 31, date: '2024-11-01' },
  { id: 5, bookId: 4, bookTitle: 'JavaScript: The Good Parts', userName: 'Grace Lee', rating: 3, comment: 'Good content but feels a bit dated now. Would love an updated edition.', sentiment: 'Neutral', helpful: 12, date: '2024-11-05' },
  { id: 6, bookId: 5, bookTitle: 'The Great Gatsby', userName: 'Frank Brown', rating: 4, comment: 'Beautifully written prose. Fitzgerald captures the essence of the American Dream.', sentiment: 'Positive', helpful: 19, date: '2024-11-08' },
];

export const recommendations = [
  { id: 1, book: books[7], reason: 'Based on your interest in technology books', confidence: 95, algorithm: 'Content-Based' },
  { id: 2, book: books[0], reason: 'Similar readers also enjoyed this', confidence: 89, algorithm: 'Collaborative' },
  { id: 3, book: books[8], reason: 'Trending in your category', confidence: 87, algorithm: 'Popularity' },
  { id: 4, book: books[3], reason: 'Complements your recent readings', confidence: 82, algorithm: 'Content-Based' },
  { id: 5, book: books[11], reason: 'Highly rated by similar profiles', confidence: 78, algorithm: 'Collaborative' },
  { id: 6, book: books[1], reason: 'All-time classic you haven\'t read', confidence: 91, algorithm: 'Content-Based' },
];

export const predictions = [
  { id: 1, memberName: 'David Wilson', bookTitle: '1984', riskLevel: 'High', probability: 85, estimatedFine: 4.50, daysOverdue: 5, avatar: 'DW' },
  { id: 2, memberName: 'Henry Kim', bookTitle: 'Design Patterns', riskLevel: 'High', probability: 92, estimatedFine: 6.00, daysOverdue: 8, avatar: 'HK' },
  { id: 3, memberName: 'Bob Smith', bookTitle: 'Clean Code', riskLevel: 'Medium', probability: 45, estimatedFine: 1.50, daysOverdue: 0, avatar: 'BS' },
  { id: 4, memberName: 'Alice Johnson', bookTitle: 'Sapiens', riskLevel: 'Low', probability: 15, estimatedFine: 0, daysOverdue: 0, avatar: 'AJ' },
  { id: 5, memberName: 'Grace Lee', bookTitle: 'JavaScript: The Good Parts', riskLevel: 'Low', probability: 20, estimatedFine: 0, daysOverdue: 0, avatar: 'GL' },
  { id: 6, memberName: 'Eva Martinez', bookTitle: 'The Pragmatic Programmer', riskLevel: 'Medium', probability: 55, estimatedFine: 2.50, daysOverdue: 2, avatar: 'EM' },
];

export const analyticsData = {
  monthlyBorrows: [
    { month: 'Jan', borrows: 45, returns: 42 },
    { month: 'Feb', borrows: 52, returns: 48 },
    { month: 'Mar', borrows: 61, returns: 55 },
    { month: 'Apr', borrows: 48, returns: 50 },
    { month: 'May', borrows: 55, returns: 52 },
    { month: 'Jun', borrows: 67, returns: 60 },
    { month: 'Jul', borrows: 72, returns: 65 },
    { month: 'Aug', borrows: 58, returns: 62 },
    { month: 'Sep', borrows: 63, returns: 58 },
    { month: 'Oct', borrows: 78, returns: 70 },
    { month: 'Nov', borrows: 85, returns: 75 },
    { month: 'Dec', borrows: 90, returns: 82 },
  ],
  genreDistribution: [
    { name: 'Fiction', value: 35, color: '#6366F1' },
    { name: 'Technology', value: 28, color: '#8B5CF6' },
    { name: 'Non-Fiction', value: 18, color: '#EC4899' },
    { name: 'Classic', value: 12, color: '#F59E0B' },
    { name: 'Science', value: 7, color: '#10B981' },
  ],
  topBooks: [
    { title: '1984', borrows: 312 },
    { title: 'To Kill a Mockingbird', borrows: 289 },
    { title: 'Sapiens', borrows: 267 },
    { title: 'Clean Code', borrows: 234 },
    { title: 'The Great Gatsby', borrows: 201 },
  ],
  memberActivity: [
    { day: 'Mon', morning: 12, afternoon: 18, evening: 8 },
    { day: 'Tue', morning: 15, afternoon: 22, evening: 10 },
    { day: 'Wed', morning: 10, afternoon: 16, evening: 12 },
    { day: 'Thu', morning: 18, afternoon: 25, evening: 14 },
    { day: 'Fri', morning: 20, afternoon: 28, evening: 16 },
    { day: 'Sat', morning: 25, afternoon: 30, evening: 20 },
    { day: 'Sun', morning: 8, afternoon: 12, evening: 6 },
  ],
};

export const availabilityPredictions = [
  { id: 1, bookTitle: '1984', currentBorrower: 'David Wilson', estimatedReturn: '3 days', demand: 'High', waitlist: 4, confidence: 88 },
  { id: 2, bookTitle: 'Design Patterns', currentBorrower: 'Henry Kim', estimatedReturn: '5 days', demand: 'Medium', waitlist: 2, confidence: 76 },
  { id: 3, bookTitle: 'Clean Code', currentBorrower: 'Bob Smith', estimatedReturn: '7 days', demand: 'High', waitlist: 3, confidence: 82 },
  { id: 4, bookTitle: 'The Pragmatic Programmer', currentBorrower: 'Eva Martinez', estimatedReturn: '2 days', demand: 'Low', waitlist: 1, confidence: 91 },
];

export const notifications = [
  { id: 1, type: 'warning', message: '3 books are overdue', time: '2 min ago' },
  { id: 2, type: 'info', message: 'New member registration: Sarah Connor', time: '15 min ago' },
  { id: 3, type: 'success', message: '"Sapiens" returned by Alice Johnson', time: '1 hour ago' },
  { id: 4, type: 'danger', message: 'Henry Kim fine exceeds $5.00', time: '2 hours ago' },
  { id: 5, type: 'info', message: 'New book added: "Atomic Habits"', time: '3 hours ago' },
];
