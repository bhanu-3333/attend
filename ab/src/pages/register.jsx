import { useState } from 'react';
import axios from 'axios';
import '../styles/Register.css'; // ✅ Import CSS

const Register = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rollNo: 0,
        roles: 'student',
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!formData.email || !formData.password || !formData.rollNo || !formData.roles) {
            setError('Please fill all the fields');
            return;
        }

        try {
            const res = await axios.post('http://localhost:5000/api/register', formData);

            if (res.data.success) {
                setSuccess('User created successfully');
                setFormData({ email: '', password: '', rollNo: 0, roles: 'student' });
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Something went wrong');
        }
    };

    return (
        <div className="register-container">
            <h2>Create Account</h2>
            <p>Register for institutional access</p>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            <form onSubmit={handleSubmit}>
                <input
                    type='email'
                    value={formData.email}
                    placeholder='Email'
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                />
                <input
                    type='number'
                    value={formData.rollNo}
                    placeholder='Roll No'
                    onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                    required
                />
                <input
                    type='password'
                    value={formData.password}
                    placeholder='Password'
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                />
                <select
                    value={formData.roles}
                    onChange={(e) => setFormData({ ...formData, roles: e.target.value })}
                    required
                >
                    <option value='student'>Student</option>
                    <option value='staff'>Staff</option>
                    <option value='hod'>HOD</option>
                </select>
                <button type='submit'>Signup</button>
            </form>
            <p>Already have an account? <a href='/login'>Login</a></p>
        </div>
    );
};

export default Register;
