import React from 'react'
import { Link } from 'react-router-dom'
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
import { cilEnvelopeOpen } from '@coreui/icons'
import './Login.css'
import bgImage from '../../../assets/images/background-login1.jpeg'

const ForgotPassword = () => {
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
            <CCard
              className="glass-card p-5 border-0"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              <CCardBody>
                <div className="text-center mb-4">
                  <h1 style={{ color: '#0e0d0dff', fontWeight: 500 }}>
                    Forgot Password
                  </h1>
                  <p style={{ color: 'rgba(12, 12, 12, 0.8)' }}>
                    Enter your email to reset your password
                  </p>
                </div>

                <CForm>
                  <CInputGroup className="mb-4">
                    <CInputGroupText className="glass-input-icon">
                      <CIcon icon={cilEnvelopeOpen} style={{ color: '#fff' }} />
                    </CInputGroupText>
                    <CFormInput
                      type="email"
                      placeholder="Email"
                      autoComplete="email"
                      className="glass-input"
                      required
                    />
                  </CInputGroup>

                  <div className="d-grid mt-4">
                    <CButton
                      color="primary"
                      className="w-100 py-3"
                      style={{
                        background: 'linear-gradient(90deg, #5f8ed0ff 0%, #4a5dcaff 100%)',
                        border: 'none',
                        borderRadius: '1px',
                        fontSize: '1.3rem',
                        marginTop: '20px'
                      }}
                    >
                      Send Reset Link
                    </CButton>
                  </div>

                  <div className="text-center mt-3">
                    <Link to="/login" style={{ textDecoration: 'none', color: '#000000ff' }}>
                      Back to Login
                    </Link>
                  </div>

                  {/* HRBS Logo + Text */}
                  <div
                    className="text-center mt-4"
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'flex-start',
                      gap: '8px'
                    }}
                  >
                    <img
                      src="/hrbs-logo.png"
                      alt="HRBS Logo"
                      style={{
                        height: '20px',
                        width: '20px',
                        transform: 'translateY(-2px)' // move logo slightly up
                      }}
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
  )
}

export default ForgotPassword
