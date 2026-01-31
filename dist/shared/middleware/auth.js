import jwt from 'jsonwebtoken';
// Stub: parse user from JWT or session. For now anonymous.
export function auth(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
        const jwtSecret = process.env.JWT_ACCESS_TOKEN_SECRET;
        try {
            const payload = jwt.verify(token, jwtSecret);
            req.user = { id: payload.userId, userType: payload.userType };
        }
        catch (err) {
            console.error("authOptional middleware JWT verification error:", err.message);
            return res.status(401).json("Unauthorized: Invalid token");
        }
    }
    else {
        // (req as any).user = undefined;
        return res.status(401).json("Invalid token");
    }
    // (req as any).user = (req as any).user || undefined;
    next();
}
