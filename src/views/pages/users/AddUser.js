import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CRow,
  CFormCheck,
  CFormSelect,
  CAlert,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser, cilEnvelopeOpen } from '@coreui/icons'

const generatePassword = (length = 10) => {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()'
  let pass = ''
  for (let i = 0; i < length; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return pass
}

const AddUser = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('Admin')
  const [autoGenerate, setAutoGenerate] = useState(true)
  const [users, setUsers] = useState([])
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [alertColor, setAlertColor] = useState('success')
  const [suggestedPassword, setSuggestedPassword] = useState(generatePassword())

  const handleAutoGenerateToggle = (checked) => {
    setAutoGenerate(checked)
    if (checked) {
      setSuggestedPassword(generatePassword())
      setPassword('')
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const finalPassword = autoGenerate ? suggestedPassword : password

    const duplicate = users.find((user) => user.email === email)
    if (duplicate) {
      setAlertMessage(`User with email "${email}" already exists as ${duplicate.role}`)
      setAlertColor('danger')
      setShowAlert(true)
      setTimeout(() => setShowAlert(false), 3000)
      return
    }

    const newUser = {
      name,
      email,
      password: finalPassword,
      role,
      date: new Date().toLocaleString(),
    }

    setUsers([...users, newUser])
    setAlertMessage(`User "${name}" created successfully as ${role}`)
    setAlertColor('success')
    setShowAlert(true)
    setTimeout(() => setShowAlert(false), 3000)

    setName('')
    setEmail('')
    setPassword('')
    setRole('Admin')
    setAutoGenerate(true)
    setSuggestedPassword(generatePassword())
  }

  return (
    <CContainer style={{ fontFamily: 'Poppins, sans-serif' }}>
      <CRow className="justify-content-center mb-5">
        <CCol md={9} lg={7} xl={6}>
          <CCard
            className="mx-4 border-0"
            style={{
              borderRadius: '40px',
              background: 'white',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
            }}
          >
            <CCardBody className="p-5">
              <CForm onSubmit={handleSubmit}>
                <h1
                  style={{
                    fontWeight: 400,
                    color: '#1e293b',
                    textAlign: 'center',
                    marginBottom: '0.4rem',
                    fontSize: '2.3rem'
                  }}
                >
                  Add New User
                </h1>
                <p
                  className="text-body-secondary"
                  style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '0.9rem' }}
                >
                  Fill details to create a new user
                </p>

                {showAlert && (
                  <CAlert color={alertColor} className="text-center fw-medium">
                    {alertMessage}
                  </CAlert>
                )}

                {/* Name Field */}
                <div
                  className="mb-4"
                  style={{
                    position: 'relative',
                    height: '3.2rem',
                    display: 'flex',
                    alignItems: 'center',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    background: 'white',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      paddingLeft: '14px',
                      paddingRight: '12px',
                      height: '100%',
                    }}
                  >
                    <CIcon icon={cilUser} style={{ color: '#326396ff', fontSize: '18px' }} />
                    <div
                      style={{
                        width: '1px',
                        height: '60%',
                        backgroundColor: '#e2e8f0',
                        marginLeft: '10px',
                      }}
                    ></div>
                  </div>

                  <CFormInput
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={{
                      fontSize: '1rem',
                      padding: '0.8rem 1rem',
                      border: 'none',
                      outline: 'none',
                      background: 'transparent',
                      fontFamily: 'Poppins',
                    }}
                  />
                </div>

                {/* Email Field */}
                <div
                  className="mb-4"
                  style={{
                    position: 'relative',
                    height: '3.2rem',
                    display: 'flex',
                    alignItems: 'center',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    background: 'white',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      paddingLeft: '14px',
                      paddingRight: '12px',
                      height: '100%',
                    }}
                  >
                    <CIcon
                      icon={cilEnvelopeOpen}
                      style={{ color: '#326396ff', fontSize: '18px' }}
                    />
                    <div
                      style={{
                        width: '1px',
                        height: '60%',
                        backgroundColor: '#e2e8f0',
                        marginLeft: '10px',
                      }}
                    ></div>
                  </div>

                  <CFormInput
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{
                      fontSize: '1rem',
                      padding: '0.8rem 1rem',
                      border: 'none',
                      outline: 'none',
                      background: 'transparent',
                      fontFamily: 'Poppins',
                    }}
                  />
                </div>

                {/* Role Dropdown */}
                <div
                  className="mb-4"
                  style={{
                    position: 'relative',
                    height: '3.2rem',
                    display: 'flex',
                    alignItems: 'center',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    background: 'white',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      paddingLeft: '14px',
                      paddingRight: '12px',
                      height: '100%',
                    }}
                  >
                    <CIcon icon={cilUser} style={{ color: '#326396ff', fontSize: '18px' }} />
                    <div
                      style={{
                        width: '1px',
                        height: '60%',
                        backgroundColor: '#e2e8f0',
                        marginLeft: '10px',
                      }}
                    ></div>
                  </div>

                  <CFormSelect
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    style={{
                      fontSize: '1rem',
                      padding: '0.8rem 1rem',
                      border: 'none',
                      outline: 'none',
                      background: 'transparent',
                      fontFamily: 'Poppins',
                    }}
                  >
                    <option value="Admin">Admin</option>
                    <option value="Recruiter">Recruiter</option>
                    <option value="Client">Client</option>
                  </CFormSelect>
                </div>

                {/* Password Field */}
                <div
                  className="mb-4"
                  style={{
                    position: 'relative',
                    height: '3.2rem',
                    display: 'flex',
                    alignItems: 'center',
                    border: `1px solid ${autoGenerate ? '#d1d5db' : '#e2e8f0'}`,
                    borderRadius: '8px',
                    background: autoGenerate ? '#f9fafb' : 'white',
                    opacity: autoGenerate ? 0.7 : 1,
                    transition: 'all 0.3s ease',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      paddingLeft: '14px',
                      paddingRight: '12px',
                      height: '100%',
                    }}
                  >
                    <CIcon
                      icon={cilLockLocked}
                      style={{
                        color: autoGenerate ? '#94a3b8' : '#326396ff',
                        fontSize: '18px',
                      }}
                    />
                    <div
                      style={{
                        width: '1px',
                        height: '60%',
                        backgroundColor: '#e2e8f0',
                        marginLeft: '10px',
                      }}
                    ></div>
                  </div>

                  <CFormInput
                    type={autoGenerate ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required={!autoGenerate}
                    disabled={autoGenerate}
                    style={{
                      fontSize: '1rem',
                      padding: '0.8rem 1rem',
                      border: 'none',
                      outline: 'none',
                      background: 'transparent',
                      fontFamily: 'Poppins',
                      flex: 1,
                      color: autoGenerate ? '#6b7280' : '#000000',
                    }}
                  />
                </div>

                {/* Auto-generate checkbox */}
                <CFormCheck
                  type="checkbox"
                  id="autoGeneratePassword"
                  label="Auto-generate password"
                  checked={autoGenerate}
                  onChange={(e) => handleAutoGenerateToggle(e.target.checked)}
                  className="mb-3"
                />

                {autoGenerate && (
                  <div
                    className="mt-3 p-3 border rounded text-center"
                    style={{
                      fontFamily: 'monospace',
                      background: '#f9fafb',
                      fontSize: '0.95rem',
                    }}
                  >
                    Suggested Password: <strong>{suggestedPassword}</strong>
                  </div>
                )}

                <div className="d-grid mt-4">
                  <CButton
                    color="primary"
                    type="submit"
                    style={{
                      fontWeight: 500,
                      fontSize: '1.1rem',
                      borderRadius: '1px',
                      padding: '0.85rem',
                      background: 'linear-gradient(135deg, #5f8ed0, #4a5dca)',
                      border: 'none',
                      fontFamily: 'Poppins',
                    }}
                  >
                    Add User
                  </CButton>
                </div>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

     {/* Table Section */}
{users.length > 0 && (
  <CRow className="justify-content-center">
    <CCol md={10}>
      <CCard
        className="mx-4 border-0 shadow-sm"
        style={{
          borderRadius: '20px',
          background: '#ffffff',
        }}
      >
        <CCardBody className="p-4">
          <h4
            className="mb-4 text-center"
            style={{
              fontWeight: 500,
              color: '#1e293b',
              letterSpacing: '0.3px',
              fontFamily: 'Poppins, sans-serif',
              fontSize: '1.8rem'
            }}
          >
            Created Users
          </h4>

          <div
            style={{
              borderRadius: '10px',
              overflow: 'hidden',
              border: '1px solid #e5e7eb',
            }}
          >
            <CTable
              responsive
              align="middle"
              className="mb-0"
              hover
              style={{
                borderCollapse: 'collapse',
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.95rem',
              }}
            >
              <CTableHead
                style={{
                  background: '#f9fafb',
                  borderBottom: '1px solid #e5e7eb',
                }}
              >
                <CTableRow>
                  <CTableHeaderCell
                    className="py-3 px-4"
                    style={{
                      fontWeight: 600,
                      color: '#374151',
                      fontSize: '0.89rem',
                      borderBottom: '1px solid #e5e7eb',
                      fontFamily: 'Poppins'
                    }}
                  >
                    Name
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    className="py-3 px-4"
                    style={{
                      fontWeight: 600,
                      color: '#374151',
                      fontSize: '0.89rem',
                      borderBottom: '1px solid #e5e7eb',
                      fontFamily: 'Poppins'

                    }}
                  >
                    Email
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    className="py-3 px-4"
                    style={{
                      fontWeight: 600,
                      color: '#374151',
                      fontSize: '0.89rem',
                      borderBottom: '1px solid #e5e7eb',
                      fontFamily: 'Poppins'
                    }}
                  >
                    Password
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    className="py-3 px-4"
                    style={{
                      fontWeight: 600,
                      color: '#374151',
                      fontSize: '0.89rem',
                      borderBottom: '1px solid #e5e7eb',
                    }}
                  >
                    Role
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    className="py-3 px-4"
                    style={{
                      fontWeight: 600,
                      color: '#374151',
                      fontSize: '0.89rem',
                      borderBottom: '1px solid #e5e7eb',
                    }}
                  >
                    Date Created
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>

              <CTableBody>
                {users.map((user, index) => (
                  <CTableRow
                    key={index}
                    style={{
                      transition: 'background 0.2s ease',
                      borderBottom: '1px solid #f1f5f9',
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = '#f9fafb')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = 'white')
                    }
                  >
                    <CTableDataCell className="py-3 px-4" style={{ color: '#111827' }}>
                      {user.name}
                    </CTableDataCell>
                    <CTableDataCell className="py-3 px-4" style={{ color: '#4b5563' }}>
                      {user.email}
                    </CTableDataCell>
                    <CTableDataCell
                      className="py-3 px-4"
                      style={{ color: '#6b7280', fontFamily: 'monospace' }}
                    >
                      {user.password}
                    </CTableDataCell>
                    <CTableDataCell className="py-3 px-4" style={{ color: '#374151' }}>
                      {user.role}
                    </CTableDataCell>
                    <CTableDataCell className="py-3 px-4" style={{ color: '#6b7280' }}>
                      {user.date}
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </div>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
)}


    </CContainer>
  )
}

export default AddUser
