import React, { useState } from 'react';
import axios from 'axios'
import { useAuth } from './AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthLayout from './AuthLayout';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const { login } = useAuth();
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};
        if (!username) newErrors.username = 'Username is required';
        if (!email) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
        if (!password) newErrors.password = 'Password is required';
        else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

   const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  try {
    const response = await axios.post(
      "https://chatzie-vqlb.onrender.com/api/auth/register",
      {
        username,
        email,
        password
      },
      {
        withCredentials: true
      }
    );

    const data = response.data;

    login(data.token);
    toast.success("Registered successfully");
    navigate("/");
  } catch (error) {
    toast.error(error.response?.data?.message || "Registration failed");
  }
};

    return (
        <AuthLayout>
            <div className='Form-wrapper'>
                <h2>Create an account</h2>
                <form className='form' onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder='Enter your username'
                            required
                        />
                        {errors.username && <span className="error">{errors.username}</span>}
                    </div>
                    <div>
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder='Enter your email'
                            required
                        />
                        {errors.email && <span className="error">{errors.email}</span>}
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <div className="password-container">
                            <input
                                type='password'
                                id='password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder='Enter your password'
                                required
                            />
                        </div>
                        {errors.password && <span className="error">{errors.password}</span>}
                    </div>
                    <button className='submit-btn' type="submit">Register</button>
                </form>
                <p>Already have an account? <Link to="/login">Login</Link></p>
            </div>
        </AuthLayout>
    );
};

export default Register;
