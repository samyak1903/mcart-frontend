// src/pages/Login.jsx
import React, { useState } from 'react';
import { signIn, signInWithRedirect } from 'aws-amplify/auth';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const { isSignedIn } = await signIn({
        username: email,
        password: password
      });

      if (isSignedIn) {
        if (isSignedIn) {
        console.log("Login Successful!");
        // Redirect the user straight to the Home page
        navigate('/'); 
      }
      }
    } catch (err) {
      console.error("Login failed", err);
      setError(err.message); 
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>
        
        {/* Displays wrong password errors directly from AWS */}
        {error && <p style={{color: 'red', fontSize: '14px'}}>{error}</p>}

        <button 
          type="button" 
          className="btn-social"
          onClick={() => signInWithRedirect({ provider: 'Google' })}
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" style={{width: '16px'}}/>
          Continue with Google
        </button>
        
        <button 
          type="button" 
          className="btn-facebook"
          onClick={() => signInWithRedirect({ provider: 'Facebook' })}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 12.073C24 5.405 18.627 0 12 0C5.373 0 0 5.405 0 12.073C0 18.102 4.416 23.1 10.125 24V15.56H7.078V12.073H10.125V9.414C10.125 6.408 11.916 4.75 14.656 4.75C15.969 4.75 17.344 4.984 17.344 4.984V7.939H15.831C14.34 7.939 13.875 8.864 13.875 9.815V12.073H17.203L16.671 15.56H13.875V24C19.584 23.1 24 18.102 24 12.073Z" />
          </svg>
          Continue with Facebook
        </button>

        <div className="divider">OR LOGIN WITH EMAIL</div>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <input 
              type="email" 
              className="form-control" 
              placeholder="Your Email Address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          
          <div className="form-group">
            <input 
              type="password" 
              className="form-control" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          <button type="submit" className="btn-theme-pink">LOGIN</button>
        </form>

        <div className="auth-links">
          Don't have an account? <Link to="/register">Register here</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;