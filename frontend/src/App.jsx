import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import LandingPage from './pages/LandingPage';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import BooksPage from './pages/dashboard/BooksPage';
import MembersPage from './pages/dashboard/MembersPage';
import IssueReturnPage from './pages/dashboard/IssueReturnPage';
import RecommendationsPage from './pages/dashboard/RecommendationsPage';
import AnalyticsPage from './pages/dashboard/AnalyticsPage';
import ReviewsPage from './pages/dashboard/ReviewsPage';
import PredictionsPage from './pages/dashboard/PredictionsPage';
import ScannerPage from './pages/dashboard/ScannerPage';
import SettingsPage from './pages/dashboard/SettingsPage';
import LoginPage from './pages/auth/LoginPage';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/about" element={<LandingPage />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="books" element={<BooksPage />} />
            <Route path="members" element={<MembersPage />} />
            <Route path="issue-return" element={<IssueReturnPage />} />
            <Route path="recommendations" element={<RecommendationsPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="reviews" element={<ReviewsPage />} />
            <Route path="predictions" element={<PredictionsPage />} />
            <Route path="scanner" element={<ScannerPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
