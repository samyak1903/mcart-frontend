import React, { useState } from 'react';
import { confirmSignUp } from 'aws-amplify/auth';
import { useNavigate, useLocation } from 'react-router-dom';

const Verify = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Grab the email passed from the Register screen, or leave blank if they navigated here manually
  const [email, setEmail] = useState(location.state?.email || '');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await confirmSignUp({
        username: email,
        confirmationCode: code
      });
      alert("Email verified successfully! You can now log in.");
      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Verify Your Email</h2>
        <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
          We sent a 6-digit verification code to your email.
        </p>
        
        {error && <p style={{color: 'red', fontSize: '14px'}}>{error}</p>}

        <form onSubmit={handleVerify}>
          <div className="form-group">
            <input 
              type="email" 
              className="form-control" 
              placeholder="Email Address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <input 
              type="text" 
              className="form-control" 
              placeholder="6-Digit Code" 
              value={code}
              onChange={(e) => setCode(e.target.value)} 
              required 
            />
          </div>

          <button type="submit" className="btn-theme-pink">VERIFY ACCOUNT</button>
        </form>
      </div>
    </div>
  );
};

export default Verify;