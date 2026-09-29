import jwt from 'jsonwebtoken';

/**
 * Generate JWT and set HTTP-only cookie on Express response
 */
export const generateToken = (res, userId) => {
  const secret = process.env.JWT_SECRET || 'supersecretjwtkey_placement_ready_2026';
  
  const token = jwt.sign({ id: userId }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

  // Set HTTP-only cookie
  res.cookie('jwt', token, {
    httpOnly: true, // Prevents XSS attacks from accessing the token via document.cookie
    secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // 'none' required for cross-domain HTTPS in production
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  });

  return token;
};
