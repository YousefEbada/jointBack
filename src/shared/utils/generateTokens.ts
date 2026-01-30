import jwt from 'jsonwebtoken';

export function generateAccessToken(payload: object) {
    const secret = process.env.JWT_ACCESS_TOKEN_SECRET!;
    return jwt.sign(payload, secret, { expiresIn: '30m' });
}

export function generateRefreshToken(payload: object) {
    const secret = process.env.JWT_REFRESH_TOKEN_SECRET!;
    return jwt.sign(payload, secret, { expiresIn: '7d' });
}