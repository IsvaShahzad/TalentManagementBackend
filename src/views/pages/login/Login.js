// src/views/login/Login.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilLockLocked, cilUser } from '@coreui/icons';
import bgImage from '../../../assets/images/background-login1.jpeg';
import './Login.css';
import { generateJWT } from './JWThelper';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    // Validation
    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Invalid email format.');
      return;
    }

    setError(''); // clear error

    // Generate JWT via helper
    const token = generateJWT({ email });

    // Store token in localStorage
    localStorage.setItem('token', token);

    // Delay navigation to see JWT in console
    setTimeout(() => {
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <div
      className="min-vh-100 d-flex flex-row align-items-center justify-content-center"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <CContainer className="d-flex justify-content-center align-items-center">
        <CRow className="justify-content-center w-100">
          <CCol md={10} lg={8} xl={6}>
            <CCard className="glass-card p-5 border-0" style={{ fontFamily: 'Poppins, sans-serif' }}>
              <CCardBody>
                <div className="text-center mb-4">
                  <h1 style={{ color: '#0e0d0dff', fontWeight: 500 }}>HRBS Login</h1>
                  <p style={{ color: 'rgba(12, 12, 12, 0.8)' }}>Welcome back! Login to continue</p>
                </div>

                <CForm>
                  <CInputGroup className="mb-4">
                    <CInputGroupText className="glass-input-icon">
                      <CIcon icon={cilUser} style={{ color: '#fff' }} />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Username or Email"
                      autoComplete="username"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="glass-input"
                    />
                  </CInputGroup>

                  <CInputGroup className="mb-4">
                    <CInputGroupText className="glass-input-icon">
                      <CIcon icon={cilLockLocked} style={{ color: '#fff' }} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="glass-input"
                    />
                  </CInputGroup>

                  {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <Link to="/forgot-password" style={{ textDecoration: 'none', color: '#000000ff' }}>
                      Forgot Password?
                    </Link>
                  </div>

                  <CButton
                    color="primary"
                    className="w-100 py-3"
                    style={{
                      background: 'linear-gradient(90deg, #5f8ed0ff 0%, #4a5dcaff 100%)',
                      border: 'none',
                      borderRadius: '1px',
                      fontSize: '1.4rem',
                    }}
                    onClick={handleLogin}
                  >
                    Login
                  </CButton>

                  <div
                    className="text-center mt-4"
                    style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: '8px' }}
                  >
                    <img
                      src="/hrbs-logo.png"
                      alt="HRBS Logo"
                      style={{ height: '20px', width: '20px', transform: 'translateY(-2px)' }}
                    />
                    <small style={{ color: 'rgba(11, 11, 11, 0.8)' }}>
                      HRBS – Empowering Human Resource Excellence
                    </small>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Login;
