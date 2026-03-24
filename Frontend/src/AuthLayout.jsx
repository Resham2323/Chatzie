import React from 'react';
import './AuthLayout.css';


const AuthLayout = ({ children, title }) => {
  return (
    <div className="auth-layout">
      <div className="auth-header">
        <img src='src/assets/chatGpt-logo.jpg' alt="Chatzie Logo" className="auth-logo" />
      </div>
      <div className="auth-content">
        {children}
      </div>
      <div className="auth-footer">
        <p>&copy; 2026 Chatzie. Made with ❤️ by Resham</p>
      </div>
    </div>
  );
};

export default AuthLayout;