import { useLocation, useNavigate } from 'react-router-dom';

const TABS = [
  { path: '/home', label: '首页', emoji: '🏠' },
  { path: '/learn', label: '学习', emoji: '📖' },
  { path: '/review', label: '复习', emoji: '🔄' },
  { path: '/profile', label: '我的', emoji: '👤' },
];

export default function TabBar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: '8px 0 env(safe-area-inset-bottom, 8px)',
      background: '#fff',
      borderTop: '1px solid #e5e7eb',
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      maxWidth: 480,
      margin: '0 auto',
    }}>
      {TABS.map(tab => {
        const active = location.pathname.startsWith(tab.path);
        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              background: 'none',
              border: 'none',
              padding: '4px 12px',
              cursor: 'pointer',
              color: active ? '#6366f1' : '#9ca3af',
              fontSize: 10,
              fontWeight: active ? 700 : 500,
              transition: 'color 0.2s',
            }}
          >
            <span style={{ fontSize: 22 }}>{tab.emoji}</span>
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
}
