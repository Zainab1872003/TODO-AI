import { sendSuccess } from '../utils/response.js';
import * as authService from '../services/auth.service.js';
import * as tokenService from '../services/token.service.js';
import jwt from 'jsonwebtoken';

export async function register(req, res, next) {
    try {
        const user = await authService.registerUser(req.body);
        sendSuccess(res, 201, 'Registration successful. Please verify your email.', {
            id: user._id,
            name: user.name,
            email: user.email,
        });
    } catch (err) {
        next(err);
    }
}

export async function login(req, res, next) {
    try {
        const { email, password } = req.body;
        const user = await authService.authenticateUser(email, password);
        const { accessToken, refreshToken } = tokenService.generateTokens(user);
        await tokenService.saveRefreshToken(user._id, refreshToken);

        res.cookie('accessToken', accessToken, {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000 // 15 minutes
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        sendSuccess(res, 200, 'Login successful', {
            accessToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                profilePic: user.profilePic
            }
        });
    } catch (err) {
        next(err);
    }
}

export async function logout(req, res, next) {
    try {
        // Get refresh token from HTTP-only cookie
        const accessToken = req.cookies?.accessToken || req.headers?.authorization?.split(' ')[1];
        if (!accessToken) {
            const error = new Error('Access token required');
            error.statusCode = 400;
            error.errors = ['Access token required'];
            throw error;
        }

        // Decode token to get user ID (this will throw if invalid/expired)
        const payload = jwt.verify(accessToken, process.env.JWT_SECRET);

        // Remove refresh token from user's DB record
        await tokenService.removeRefreshToken(payload.id, req.cookies?.refreshToken);

        // Clear both access and refresh token cookies
        res.clearCookie('accessToken', { path: '/' });
        res.clearCookie('refreshToken', { path: '/' });

        sendSuccess(res, 200, 'Logout successful', null);
    } catch (err) {
        next(err);
    }
}


export async function refresh(req, res, next) {
    try {
        const { refreshToken } = req.body || req.cookies?.refreshToken;
        if (!refreshToken) {
            const error = new Error('Refresh token required');
            error.statusCode = 400;
            error.errors = ['Refresh token required'];
            throw error;
        }
        const user = await tokenService.validateRefreshToken(refreshToken);
        const { accessToken, refreshToken: newRefreshToken } = tokenService.generateTokens(user);

        // Rotate refresh tokens
        await tokenService.removeRefreshToken(user._id, refreshToken);
        await tokenService.saveRefreshToken(user._id, newRefreshToken);

        sendSuccess(res, 200, 'Token refreshed', {
            accessToken,
            refreshToken: newRefreshToken
        });
    } catch (err) {
        next(err);
    }
}