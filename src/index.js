// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Amplify } from 'aws-amplify';

// Dynamically pull the URL, fallback to localhost for local development
const clientUrl = process.env.REACT_APP_CLIENT_URL || 'http://localhost:3000';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'ap-south-1_H8A8oUaiM', 
      userPoolClientId: '5cem2a48bi9rvj6viuufr45ak1',
      loginWith: { 
        email: true,
        oauth: {
          domain: 'ap-south-1h8a8ouaim.auth.ap-south-1.amazoncognito.com',
          scopes: ['email', 'profile', 'openid', 'aws.cognito.signin.user.admin'],
          // We inject the dynamic variable directly into the arrays
          redirectSignIn: [`${clientUrl}/`], 
          redirectSignOut: [`${clientUrl}/`], 
          responseType: 'code'
        }
      }
    }
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);