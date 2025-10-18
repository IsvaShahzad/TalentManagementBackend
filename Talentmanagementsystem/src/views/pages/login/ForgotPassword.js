import React, { useState } from 'react'
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
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { sendForgotPasswordLink } from '../../../api/api'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const sendResetLink = async () => {
    if (!email) {
      toast.error("Email is required")
      alert("Email is required")
      return
    }

    setLoading(true)
    try {
      const data = await sendForgotPasswordLink(email)
      const msg = data.message || "Reset link sent!"
      toast.success(msg)
      alert(msg)
      setEmail('') // clear input
    } catch (err) {
      console.error(err)
      const errorMsg = err?.response?.data?.message || "Server error. Please try again later."
      toast.error(errorMsg)
      alert(errorMsg)
    } finally {
      setLoading(false)
    }
  }

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
                  <h1 style={{ color: '#0e0d0dff', fontWeight: 500 }}>Forgot Password</h1>
                  <p style={{ color: 'rgba(12, 12, 12, 0.8)' }}>Enter your email to reset your password</p>
                </div>

                <CForm
                  onSubmit={(e) => {
                    e.preventDefault()
                    sendResetLink()
                  }}
                >
                  <CInputGroup className="mb-4">
                    <CInputGroupText className="glass-input-icon">
                      <CIcon icon={cilEnvelopeOpen} style={{ color: '#fff' }} />
                    </CInputGroupText>
                    <CFormInput
                      type="email"
                      placeholder="Email"
                      autoComplete="email"
                      className="glass-input"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? "Sending..." : "Send Reset Link"}
                    </CButton>
                  </div>
                </CForm>

                <div className="text-center mt-3">
                  <Link to="/login" style={{ textDecoration: 'none', color: '#000000ff' }}>
                    Back to Login
                  </Link>
                </div>

                <div
                  className="text-center mt-4"
                  style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: '8px' }}
                >
                  <img src="/hrbs-logo.png" alt="HRBS Logo" style={{ height: '20px', width: '20px', transform: 'translateY(-2px)' }} />
                  <small style={{ color: 'rgba(11, 11, 11, 0.8)' }}>
                    HRBS – Your Global Business Partner
                  </small>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  )
}

export default ForgotPassword
