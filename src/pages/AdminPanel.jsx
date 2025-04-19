import { useState } from 'react';
import api from '../api/client';

export default function AdminPanel() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    level: '',
    answer: '',
    price: '',
    file: null
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setMessage('');
      await api.uploadTask(formData);
      setMessage('Task uploaded successfully!');
      setFormData({ name: '', description: '', level: '', answer: '', price: '', file: null });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', boxShadow: '0 0 10px rgba(0,0,0,0.1)', borderRadius: '8px' }}>
      <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Admin Panel</h2>

      {message && <div style={{ padding: '10px', marginBottom: '20px', background: '#e6ffe6', border: '1px solid #b3ffb3', borderRadius: '4px', color: '#006600' }}>{message}</div>}
      {error && <div style={{ padding: '10px', marginBottom: '20px', background: '#ffe6e6', border: '1px solid #ffb3b3', borderRadius: '4px', color: '#990000' }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
            required
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', minHeight: '80px' }}
            required
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Level</label>
          <select
            value={formData.level}
            onChange={(e) => setFormData((prev) => ({ ...prev, level: e.target.value }))}
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
            required
          >
            <option value="">Select Level</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
            <option value="Expert">Expert</option>
            <option value="Master">Master</option>
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Answer</label>
          <input
            type="text"
            value={formData.answer}
            onChange={(e) => setFormData((prev) => ({ ...prev, answer: e.target.value }))}
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
            required
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Price</label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
            required
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>File</label>
          <input
            type="file"
            onChange={(e) => setFormData((prev) => ({ ...prev, file: e.target.files[0] }))}
            style={{ width: '100%' }}
            required
          />
        </div>

        <button
          type="submit"
          style={{ width: '100%', padding: '10px', background: '#000', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Upload Task
        </button>
      </form>
    </div>
  );
}