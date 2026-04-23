import React, { useState } from 'react';
import { signUp } from 'aws-amplify/auth';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  // Added countryCode to state, default to +91
  const [formData, setFormData] = useState({ email: '', password: '', countryCode: '+91', phone: '', gender: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    
    // Combine the country code and phone number before sending to AWS
    const fullPhoneNumber = `${formData.countryCode}${formData.phone}`;
    
    try {
      await signUp({
        username: formData.email,
        password: formData.password,
        options: {
          userAttributes: {
            email: formData.email,
            phone_number: fullPhoneNumber,
            gender: formData.gender
          }
        }
      });
      // Route to the verify screen and pass the email along so they don't have to retype it!
      navigate('/verify', { state: { email: formData.email } });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Register</h2>
        {error && <p style={{color: 'red', fontSize: '14px'}}>{error}</p>}
        
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <input type="email" name="email" className="form-control" placeholder="Your Email Address" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <input type="password" name="password" className="form-control" placeholder="Choose Password" onChange={handleChange} required />
          </div>
          
          {/* NEW: Side-by-side Country Code and Phone Number */}
          <div className="form-group" style={{ display: 'flex', gap: '10px' }}>
            <select name="countryCode" className="form-control" onChange={handleChange} style={{ width: '35%' }}>
              <option value="+91">India (+91)</option>
              <option value="+1">USA (+1)</option>
              <option value="+44">UK (+44)</option>
              <option value="+61">Australia (+61)</option>
            </select>
            <input type="tel" name="phone" className="form-control" placeholder="Mobile Number" onChange={handleChange} style={{ width: '65%' }} required />
          </div>

          <div className="form-group">
            <select name="gender" className="form-control" onChange={handleChange} required>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          
          <button type="submit" className="btn-theme-pink">REGISTER</button>
        </form>
        
        <div className="auth-links">
          Already have an account? <Link to="/login">Sign in here</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;