import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rollNo: '',
    roles: 'student',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/api/auth/signin', formData);
      
      if (res.data.success) {
        // Save the token if needed
        localStorage.setItem('token', res.data.token);
        navigate('/profile'); // Redirect after successful login
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={formData.email}
          placeholder="Email"
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <input
          type="number"
          value={formData.rollNo}
          placeholder="Roll No"
          onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
          required
        />
        <input
          type="password"
          value={formData.password}
          placeholder="Password"
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />
        <select
          value={formData.roles}
          onChange={(e) => setFormData({ ...formData, roles: e.target.value })}
          required
        >
          <option value="student">Student</option>
          <option value="staff">Staff</option>
          <option value="hod">HOD</option>
        </select>
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account? <a href="/signup">Signup</a>
      </p>
    </div>
  );
};

export default Login;
