// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Amplify } from 'aws-amplify';

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
          redirectSignIn: ['http://localhost:3000/'], // Where AWS sends you back after login
          redirectSignOut: ['http://localhost:3000/login'], // Where AWS sends you on logout
          responseType: 'code'
        }
      }
    }
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);