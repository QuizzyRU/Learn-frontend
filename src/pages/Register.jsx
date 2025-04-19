import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/client';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      console.log(formData);
      await api.auth.register(formData.username, formData.password, formData.name);
      navigate('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: '400px',
      margin: '40px auto',
      padding: '20px',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      borderRadius: '8px'
    }}>
      <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Регистрация</h2>
      
      {error && (
        <div style={{
          padding: '10px',
          marginBottom: '20px',
          background: '#fee',
          border: '1px solid #fcc',
          borderRadius: '4px',
          color: '#c00'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label 
            htmlFor="name"
            style={{ display: 'block', marginBottom: '5px' }}
          >
            Имя
          </label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
            required
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label 
            htmlFor="username"
            style={{ display: 'block', marginBottom: '5px' }}
          >
            Имя пользователя
          </label>
          <input
            id="username"
            type="text"
            value={formData.username}
            onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
            required
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label 
            htmlFor="password"
            style={{ display: 'block', marginBottom: '5px' }}
          >
            Пароль
          </label>
          <input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData((prev) => {
              return { ...prev, password: e.target.value };
            })}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '10px',
            background: '#000',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? 'Регистрация...' : 'Зарегистрироваться'}
        </button>

        <p style={{ 
          marginTop: '20px',
          textAlign: 'center',
          color: '#666'
        }}>
          Уже есть аккаунт? {' '}
          <Link 
            to="/login"
            style={{
              color: '#000',
              textDecoration: 'none'
            }}
          >
            Войти
          </Link>
        </p>
      </form>
    </div>
  );
}