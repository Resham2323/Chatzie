import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        // TODO: Implement forgot password API call
        toast.success('Password reset link sent to your email');
    };

    return (
        <div className='container'>
            <div className='Form-wrapper'>
                <h2>Reset Password</h2>
                <form className='form' onSubmit={handleSubmit}>
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
                    </div>
                    <button type="submit">Send Reset Link</button>
                </form>
                <p>Remember your password? <Link to="/login">Login</Link></p>
            </div>
        </div>
    );
};

export default ForgotPassword;