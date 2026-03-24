import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthLayout from './AuthLayout';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};
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
            console.log("Trigger login handle submit before request")
            const response = await axios.post("http://localhost:8080/api/auth/login",
                {
                    email,
                    password
                },{
                    withCredentials: true
                }
            );

            console.log("Trigger login handle submit after request")
            const data = response.data;
            console.log(data);
            login(data.token);
            toast.success('Logged in successfully');
            navigate('/');
        }
        catch (error) {
             console.log(error); // 👈
            toast.error('Login failed');
        }
    };

    return (
        <AuthLayout>
            <div className='Form-wrapper'>
                <h2>Login</h2>
                <form className='form' onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder='email'
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder='password'
                            required
                        />
                    </div>
                    <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
                        <Link to="/forgot-password" style={{ fontSize: '0.9rem' }}>Forgot Password?</Link>
                    </div>
                    <button className='Submit-btn' type="submit">Login</button>
                </form>
                <p>Don't have an account? <Link to="/register">Register</Link></p>
            </div>
        </AuthLayout>
    );
};

export default Login;
