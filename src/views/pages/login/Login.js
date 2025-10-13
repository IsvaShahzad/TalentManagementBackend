import React from 'react'
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
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import './Login.css'
import bgImage from '../../../assets/images/background-login1.jpeg'

const Login = () => {
  return (
    <div
      className="min-vh-100 d-flex flex-row align-items-center justify-content-center"
      style={{
        backgroundImage: `url(${bgImage})`, // 👈 use imported image
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <CContainer className="d-flex justify-content-center align-items-center">
        <CRow className="justify-content-center w-100">
          <CCol md={10} lg={8} xl={6}>
            <CCard className="glass-card p-5 border-0">
              <CCardBody>
                <div className="text-center mb-4">
                  <h1 className="fw-bold" style={{ color: '#0e0d0dff', fontFamily: 'Montserrat' }}>
                    HRBS Login
                  </h1>
                  <p style={{ color: 'rgba(12, 12, 12, 0.8)', fontFamily: 'Montserrat' }}>
                    Welcome back! Login to continue
                  </p>
                </div>

                <CForm>
                  <CInputGroup className="mb-4">
                    <CInputGroupText className="glass-input-icon">
                      <CIcon icon={cilUser} style={{ color: '#fff' }} />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Username or Email"
                      autoComplete="username"
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
                      className="glass-input"
                    />
                  </CInputGroup>

                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <a href="#" style={{ textDecoration: 'none', color: '#000000ff' }}>
                      Forgot Password?
                    </a>
                  </div>

                  <CButton
                    color="primary"
                    className="w-100 py-3 fw-semibold"
                    style={{
                      background: 'linear-gradient(90deg, #5c6bc0 0%, #3f51b5 100%)',
                      border: 'none',
                      borderRadius: '1px',
                      fontSize: '1.3rem',
                      fontFamily: 'Montserrat',
                    }}
                  >
                    Login
                  </CButton>

                  <div className="text-center mt-4">
                    <small style={{ color: 'rgba(11, 11, 11, 0.8)', fontFamily: 'Montserrat' }}>
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
  )
}

export default Login
