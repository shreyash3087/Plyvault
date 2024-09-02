import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const secret = process.env.JWT_SECRET;

// Create a JWT token
export const createToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    secret,
    { expiresIn: '1h' }
  );
};
export const verifyToken = (token) => {
  if (typeof token !== 'string') {
    console.error('Invalid token type:', typeof token);
    return null;
  }
  
  try {
    return jwt.verify(token, secret);
  } catch (e) {
    console.error('Token verification error:', e);
    return null;
  }
};


// Hash the user's password
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Compare the provided password with the hashed password
export const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};
