import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';

export default function Rating() {
  const [rating, setRating] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadRating = async () => {
      try {
        setLoading(true);
        const data = await api.task.getTop();
        setRating(data.users);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadRating();
  }, []);

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', textAlign: 'center' }}>
      <h1>Рейтинг пользователей</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc', padding: '10px' }}>Место</th>
            <th style={{ border: '1px solid #ccc', padding: '10px' }}>Пользователь</th>
            <th style={{ border: '1px solid #ccc', padding: '10px' }}>Очки</th>
          </tr>
        </thead>
        <tbody>
          {rating && rating.map((user, index) => (
            <tr key={user.username}>
              <td style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center', fontWeight: 'bold', color: index === 0 ? '#ffd700' : index === 1 ? '#c0c0c0' : index === 2 ? '#cd7f32' : 'inherit' }}>{index + 1}</td>
              <td style={{ border: '1px solid #ccc', padding: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img 
                  src={user.avatar ? `http://localhost:8000/${user.avatar}` : 'https://via.placeholder.com/50'} 
                  alt={user.username} 
                  style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                />
                <Link to={`/user/${user.username}`} style={{ textDecoration: 'none', color: 'blue' }}>
                  {user.username}
                </Link>
              </td>
              <td style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>{user.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}