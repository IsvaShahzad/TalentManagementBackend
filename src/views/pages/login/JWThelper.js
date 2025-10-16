// src/helpers/jwtHelper.js
import jwtEncode from 'jwt-encode'

const JWT_SECRET = 'demo-secret'

export const generateJWT = (payload) => {
  const token = jwtEncode(payload, JWT_SECRET)
  console.log('Generated JWT:', token) // prints in browser console
  return token
}
