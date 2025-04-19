import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/client';

export default function UserProfile() {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadUserProfile();
  }, [username]);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const userData = await api.getUserProfile(username);
      const progressData = await api.user.getUserProgress(username);
      setUser(userData);
      setProgress(progressData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: '250px 1fr',
        gap: '40px',
        marginBottom: '40px'
      }}>
        {/* Профиль */}
        <div>
          <div style={{ 
            width: '200px',
            height: '200px',
            border: '1px solid #ccc',
            borderRadius: '50%',
            overflow: 'hidden',
            marginBottom: '20px'
          }}>
            <img 
              src={"http://localhost:8000/"+user.avatar || 'https://via.placeholder.com/200'} 
              alt={user.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <div>
            <h2>{user.name}</h2>
            <p style={{ color: '#666', marginBottom: '10px' }}>@{user.username}</p>
            <p>{user.description || 'Нет описания'}</p>
          </div>
        </div>

        {/* Прогресс */}
        <div>
          <h2 style={{ marginBottom: '20px' }}>Статистика</h2>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '40px'
          }}>
            <div style={{ 
              padding: '20px',
              border: '1px solid #ccc',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                {progress?.statistics.total_points_earned || 0}
              </div>
              <div>Очков набрано</div>
            </div>

            <div style={{ 
              padding: '20px',
              border: '1px solid #ccc',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                {progress?.statistics.total_tasks_completed || 0}
              </div>
              <div>Заданий решено</div>
            </div>
          </div>

          <h3 style={{ marginBottom: '15px' }}>Решенные задания по уровням</h3>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '15px',
            marginBottom: '40px'
          }}>
            {Object.entries(progress?.statistics.tasks_by_level || {}).map(([level, count]) => (
              <div 
                key={level}
                style={{ 
                  padding: '15px',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{count}</div>
                <div>{level}</div>
              </div>
            ))}
          </div>

          <h3 style={{ marginBottom: '15px' }}>Последние решения</h3>
          {progress?.statistics.recent_results.length > 0 ? (
            <div style={{ display: 'grid', gap: '15px' }}>
              {progress.statistics.recent_results.map((result) => (
                <div
                  key={result.id}
                  style={{
                    padding: '15px',
                    border: '1px solid #ccc',
                    borderRadius: '8px'
                  }}
                >
                  <div style={{ 
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '10px'
                  }}>
                    <h4 style={{ margin: 0 }}>{result.task.name}</h4>
                    <div style={{
                      padding: '4px 8px',
                      background: '#eee',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}>
                      +{result.points_earned} очков
                    </div>
                  </div>
                  <p style={{ 
                    margin: '0',
                    color: '#666',
                    fontSize: '14px'
                  }}>
                    {result.task.description}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#666', fontSize: '14px' }}>Пользователь новенький и пока не решил ни одной задачи.</p>
          )}
        </div>
      </div>
    </div>
  );
}