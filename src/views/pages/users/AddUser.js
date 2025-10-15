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
import { cilLockLocked, cilUser, cilEnvelopeOpen, cilLowVision } from '@coreui/icons'

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
  const [suggestedPassword, setSuggestedPassword] = useState(generatePassword())
  const [showPassword, setShowPassword] = useState({}) // track visibility per user in table

  const handleAutoGenerateToggle = (checked) => {
    setAutoGenerate(checked)
    if (checked) {
      setSuggestedPassword(generatePassword())
      setPassword('')
    }
  }
  const [alertColor, setAlertColor] = useState('success')


 const handleSubmit = (e) => {
  e.preventDefault()
  const finalPassword = autoGenerate ? suggestedPassword : password

  // Check for duplicate email
  const duplicate = users.find((user) => user.email === email)
  if (duplicate) {
  setAlertMessage(`User with email "${email}" already exists as ${duplicate.role}`)
  setAlertColor('danger')  // <-- red alert
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
  setAlertColor('success') // <-- success alert stays green
  setShowAlert(true)
  setTimeout(() => setShowAlert(false), 3000)

  // Reset form
  setName('')
  setEmail('')
  setPassword('')
  setRole('Admin')
  setAutoGenerate(true)
  setSuggestedPassword(generatePassword())
}


  const togglePasswordVisibility = (idx) => {
    setShowPassword({ ...showPassword, [idx]: !showPassword[idx] })
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-column align-items-center py-4">
      <CContainer>
        <CRow className="justify-content-center mb-4">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4 shadow-sm rounded">
              <CCardBody className="p-4">
                <CForm onSubmit={handleSubmit}>
                  <h1>Add New User</h1>
                  <p className="text-body-secondary">Fill details to create a new user</p>

                  {showAlert && <CAlert color="success">{alertMessage}</CAlert>}

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

                  <CInputGroup className="mb-3">
                    <CInputGroupText>Role</CInputGroupText>
                    <CFormSelect value={role} onChange={(e) => setRole(e.target.value)}>
                      <option value="Admin">Admin</option>
                      <option value="Recruiter">Recruiter</option>
                      <option value="Client">Client</option>
                    </CFormSelect>
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type={autoGenerate ? 'text' : 'password'}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={autoGenerate}
                      required={!autoGenerate}
                    />
                  </CInputGroup>

                  <CFormCheck
                    type="checkbox"
                    id="autoGeneratePassword"
                    label="Auto-generate password"
                    checked={autoGenerate}
                    onChange={(e) => handleAutoGenerateToggle(e.target.checked)}
                  />

                  {autoGenerate && (
                    <div className="mt-2 p-2 bg-light border rounded" style={{ fontFamily: 'monospace' }}>
                      Suggested Password: <strong>{suggestedPassword}</strong>
                    </div>
                  )}

                  <div className="d-grid mt-4">
                    <CButton
                      color="primary"
                      type="submit"
                      style={{ fontWeight: 500, fontSize: '1.1rem' }}
                    >
                      Add User
                    </CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>

        {users.length > 0 && (
          <CRow className="justify-content-center">
            <CCol md={12}>
              <CCard className="mx-4 shadow-sm rounded">
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
                          <CTableDataCell className="d-flex align-items-center">
                            <span
                              style={{
                                background: '#f0f0f0',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                fontFamily: 'monospace',
                                marginRight: '8px',
                              }}
                            >
                              {showPassword[idx] ? user.password : '*'.repeat(user.password.length)}
                            </span>
                            <CIcon
                              icon={cilLowVision}
                              onClick={() => togglePasswordVisibility(idx)}
                              style={{ cursor: 'pointer' }}
                            />
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
