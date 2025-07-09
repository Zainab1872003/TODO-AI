import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';


export function generateTokens(user) {
    const payload = { id: user._id, email: user.email, isVerified: user.isVerified, role: user.role };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '1h'
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
    });
    return { accessToken, refreshToken };
}

export async function saveRefreshToken(userId, refreshToken) {
    await User.findByIdAndUpdate(userId, { $push: { refreshTokens: refreshToken } });
}

export async function removeRefreshToken(userId, refreshToken) {
    await User.findByIdAndUpdate(userId, { $pull: { refreshTokens: refreshToken } });
}

export async function validateRefreshToken(token) {
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(payload.id);
        if (!user || !user.refreshTokens.includes(token)) {
            throw new Error('Invalid refresh token');
        }
        return user;
    } catch (err) {
        const error = new Error('Invalid or expired refresh token');
        error.statusCode = 401;
        error.errors = ['Invalid or expired refresh token'];
        throw error;
    }
}
