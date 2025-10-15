import React, { useState } from 'react'
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
  CFormCheck,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CFormSelect,
  CAlert,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser, cilEnvelopeOpen } from '@coreui/icons'

const generatePassword = (length = 10) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()'
  let pass = ''
  for (let i = 0; i < length; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return pass
}
// ...all previous imports

const AddUser = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('Admin')
  const [autoGenerate, setAutoGenerate] = useState(true)
  const [users, setUsers] = useState([])
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [suggestedPassword, setSuggestedPassword] = useState(generatePassword()) // new state

  // Update suggested password whenever autoGenerate is checked
  const handleAutoGenerateToggle = (checked) => {
    setAutoGenerate(checked)
    if (checked) {
      setSuggestedPassword(generatePassword())
      setPassword('') // clear manual input
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const finalPassword = autoGenerate ? suggestedPassword : password

    const newUser = {
      name,
      email,
      password: finalPassword,
      role,
      date: new Date().toLocaleString(),
    }

    setUsers([...users, newUser])

    // show alert
    setAlertMessage(`User "${name}" created successfully as ${role}`)
    setShowAlert(true)
    setTimeout(() => setShowAlert(false), 3000)

    // reset form
    setName('')
    setEmail('')
    setPassword('')
    setRole('Admin')
    setAutoGenerate(true)
    setSuggestedPassword(generatePassword())
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-column align-items-center py-4">
      <CContainer>
        <CRow className="justify-content-center mb-4">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm onSubmit={handleSubmit}>
                  <h1>Add New User</h1>
                  <p className="text-body-secondary">Fill details to create a new user</p>

                  {showAlert && <CAlert color="success">{alertMessage}</CAlert>}

                  {/* Name */}
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </CInputGroup>

                  {/* Email */}
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilEnvelopeOpen} />
                    </CInputGroupText>
                    <CFormInput
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </CInputGroup>

                  {/* Role */}
                  <CInputGroup className="mb-3">
                    <CInputGroupText>Role</CInputGroupText>
                    <CFormSelect value={role} onChange={(e) => setRole(e.target.value)}>
                      <option value="Admin">Admin</option>
                      <option value="Recruiter">Recruiter</option>
                      <option value="Client">Client</option>
                    </CFormSelect>
                  </CInputGroup>

                  {/* Password */}
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={autoGenerate}
                      required={!autoGenerate}
                    />
                  </CInputGroup>

                  {/* Auto-generate password toggle */}
                  <CFormCheck
                    type="checkbox"
                    id="autoGeneratePassword"
                    label="Auto-generate password"
                    checked={autoGenerate}
                    onChange={(e) => handleAutoGenerateToggle(e.target.checked)}
                  />

                  {/* Suggested password box */}
                  {autoGenerate && (
                    <div
                      className="mt-2 p-2 bg-light border rounded"
                      style={{ fontFamily: 'monospace' }}
                    >
                      Suggested Password: <strong>{suggestedPassword}</strong>
                    </div>
                  )}

                  <div className="d-grid mt-4">
                    <CButton color="success" type="submit">
                      Add User
                    </CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>

        {/* Users Table */}
        {users.length > 0 && (
          <CRow className="justify-content-center">
            <CCol md={12}>
              <CCard className="mx-4">
                <CCardBody className="p-4">
                  <h2>Added Users</h2>
                  <CTable striped hover responsive>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell>Name</CTableHeaderCell>
                        <CTableHeaderCell>Email</CTableHeaderCell>
                        <CTableHeaderCell>Role</CTableHeaderCell>
                        <CTableHeaderCell>Password</CTableHeaderCell>
                        <CTableHeaderCell>Date Added</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {users.map((user, idx) => (
                        <CTableRow key={idx}>
                          <CTableDataCell>{user.name}</CTableDataCell>
                          <CTableDataCell>{user.email}</CTableDataCell>
                          <CTableDataCell>{user.role}</CTableDataCell>
                          <CTableDataCell>
                            <span
                              style={{
                                background: '#f0f0f0',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                fontFamily: 'monospace',
                              }}
                            >
                              {user.password}
                            </span>
                          </CTableDataCell>
                          <CTableDataCell>{user.date}</CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        )}
      </CContainer>
    </div>
  )
}

export default AddUser

