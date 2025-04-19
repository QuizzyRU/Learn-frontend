import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/client';

export default function Profile() {
  const { user } = useAuth();
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    description: ''
  });

  useEffect(() => {
    loadProgress();
    if (user) {
      setFormData({
        name: user.name || '',
        username: user.username || '',
        description: user.description || ''
      });
    }
  }, [user]);

  const loadProgress = async () => {
    try {
      setLoading(true);
      const data = await api.user.getProgress();
      setProgress(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.user.updateProfile(formData);
      setEditMode(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        await api.user.uploadAvatar(file);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (!user) return null;
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
          
          <label style={{
            display: 'inline-block',
            padding: '8px 16px',
            background: '#000',
            color: '#fff',
            borderRadius: '4px',
            cursor: 'pointer',
            marginBottom: '20px'
          }}>
            Загрузить аватар
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              style={{ display: 'none' }}
            />
          </label>

          {!editMode ? (
            <div>
              <h2>{user.name}</h2>
              <p style={{ color: '#666', marginBottom: '10px' }}>@{user.username}</p>
              <p>{user.description || 'Нет описания'}</p>
              <button
                onClick={() => setEditMode(true)}
                style={{
                  padding: '8px 16px',
                  background: 'none',
                  border: '1px solid #000',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  marginTop: '10px'
                }}
              >
                Редактировать профиль
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Имя</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ccc',
                    borderRadius: '4px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Имя пользователя</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ccc',
                    borderRadius: '4px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>О себе</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    minHeight: '100px'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="submit"
                  style={{
                    padding: '8px 16px',
                    background: '#000',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Сохранить
                </button>
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  style={{
                    padding: '8px 16px',
                    background: 'none',
                    border: '1px solid #000',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Отмена
                </button>
              </div>
            </form>
          )}
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
          <div style={{ display: 'grid', gap: '15px' }}>
            {progress?.statistics.recent_results.map((result) => (
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
        </div>
      </div>
    </div>
  );
}