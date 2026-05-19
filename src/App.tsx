import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import TabBar from './components/TabBar';
import Home from './pages/Home';
import Learn from './pages/Learn';
import Review from './pages/Review';
import Profile from './pages/Profile';

export default function App() {
  return (
    <HashRouter>
      <div style={{
        maxWidth: 480,
        margin: '0 auto',
        minHeight: '100vh',
        background: '#f8fafc',
      }}>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/review" element={<Review />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
        <TabBar />
      </div>
    </HashRouter>
  );
}
