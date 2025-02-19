import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css'; // ✅ Import the CSS

const Login = () => {
  const [formData, setFormData] = useState({
    password: '',
    rollNo: 0,
    roles: 'student',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/api/login', formData);

      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        console.log("Login successful");
        navigate('/dashboard');
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
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
