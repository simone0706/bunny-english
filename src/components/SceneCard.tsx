import type { SceneInfo } from '../types';

interface SceneCardProps {
  scene: SceneInfo;
  total: number;
  learned: number;
  onClick: () => void;
}

export default function SceneCard({ scene, total, learned, onClick }: SceneCardProps) {
  const pct = total > 0 ? Math.round((learned / total) * 100) : 0;

  return (
    <button
      onClick={onClick}
      style={{
        background: scene.gradient,
        border: 'none',
        borderRadius: 20,
        padding: 0,
        cursor: 'pointer',
        overflow: 'hidden',
        width: '100%',
        textAlign: 'left',
        position: 'relative',
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '20px',
        color: '#fff',
      }}>
        <span style={{ fontSize: 36 }}>{scene.emoji}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 17, fontWeight: 700 }}>{scene.tag}</div>
          <div style={{ fontSize: 13, opacity: 0.8, marginTop: 2 }}>
            {learned} / {total} 已学
          </div>
          <div style={{
            height: 4,
            background: 'rgba(255,255,255,0.3)',
            borderRadius: 2,
            marginTop: 8,
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${pct}%`,
              background: '#fff',
              borderRadius: 2,
              transition: 'width 0.4s',
            }} />
          </div>
        </div>
        <span style={{ fontSize: 18, opacity: 0.7 }}>→</span>
      </div>
    </button>
  );
}
