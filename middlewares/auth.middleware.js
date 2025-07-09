
import jwt from 'jsonwebtoken';
import { sendError } from '../utils/response.js';


export function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers['authorization'] || req.cookies?.accessToken;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 401, 'Authorization token is required.', ['Authorization header missing or malformed']);
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    console.log('JWT Payload:', decoded);
    console.log('User role from token:', decoded.role);
    next();
  } catch (err) {
    return sendError(res, 401, 'Invalid or expired token.', [err.message]);
  }
}

export const isAdmin = (req, res, next) => {
  console.log("here you go");
  if (req.user && req.user.role === 'admin') return next();
  return res.status(403).json({ error: 'Admin access only' });
};

export default { authenticateToken };