/**
 * AI Fine & Late Return Prediction Engine
 * 
 * Predicts probability of late returns based on:
 * - Member's late return history
 * - Current overdue status
 * - Days remaining until due date
 * - Total fines accrued
 * - Number of books currently borrowed
 */

/**
 * Predict late return risk for active transactions
 */
function predictLateReturns(transactions) {
  return transactions.map(t => {
    const now = new Date();
    const dueDate = new Date(t.due_date);
    const daysUntilDue = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));
    const isOverdue = daysUntilDue < 0;
    const daysOverdue = isOverdue ? Math.abs(daysUntilDue) : 0;

    // Calculate risk factors
    let probability = 20; // Base probability

    // Factor 1: Current overdue status (strongest signal)
    if (isOverdue) {
      probability += 40 + Math.min(daysOverdue * 3, 30);
    }

    // Factor 2: Historical late return rate
    const lateRate = t.total_transactions > 0 
      ? (t.late_count / t.total_transactions) * 100 
      : 0;
    probability += lateRate * 0.3;

    // Factor 3: Days remaining (closer to due = higher risk)
    if (!isOverdue && daysUntilDue <= 3) {
      probability += (4 - daysUntilDue) * 8;
    }

    // Factor 4: Number of books borrowed (more books = higher risk)
    if (t.books_borrowed > 5) {
      probability += (t.books_borrowed - 5) * 3;
    }

    // Factor 5: Previous fines (indicates pattern)
    if (parseFloat(t.total_fines) > 5) {
      probability += 10;
    }

    // Clamp probability
    probability = Math.min(99, Math.max(5, Math.round(probability)));

    // Determine risk level
    let riskLevel;
    if (probability >= 70) riskLevel = 'High';
    else if (probability >= 40) riskLevel = 'Medium';
    else riskLevel = 'Low';

    // Estimate fine
    const estimatedFine = isOverdue 
      ? daysOverdue * 0.50 
      : (probability > 60 ? Math.ceil(probability / 20) * 0.50 : 0);

    return {
      transactionId: t.id,
      memberName: t.member_name,
      memberEmail: t.member_email,
      bookTitle: t.book_title,
      bookAuthor: t.book_author,
      dueDate: t.due_date,
      daysUntilDue,
      daysOverdue,
      probability,
      riskLevel,
      estimatedFine: parseFloat(estimatedFine.toFixed(2)),
      factors: {
        overdue: isOverdue,
        lateHistoryRate: `${lateRate.toFixed(1)}%`,
        totalFines: `$${parseFloat(t.total_fines).toFixed(2)}`,
        booksBorrowed: t.books_borrowed
      },
      avatar: t.member_name.split(' ').map(n => n[0]).join('')
    };
  }).sort((a, b) => b.probability - a.probability);
}

/**
 * Predict monthly fine totals
 */
function predictFines(fineHistory) {
  if (fineHistory.length < 2) return { predicted: 0, trend: 'stable' };

  // Simple moving average prediction
  const values = fineHistory.map(f => parseFloat(f.total_fines));
  const avg = values.reduce((s, v) => s + v, 0) / values.length;
  
  // Trend detection
  const recentAvg = values.slice(-3).reduce((s, v) => s + v, 0) / Math.min(3, values.length);
  const trend = recentAvg > avg * 1.1 ? 'increasing' : recentAvg < avg * 0.9 ? 'decreasing' : 'stable';

  return {
    predicted: parseFloat(recentAvg.toFixed(2)),
    trend,
    monthlyAverage: parseFloat(avg.toFixed(2))
  };
}

module.exports = {
  predictLateReturns,
  predictFines
};
