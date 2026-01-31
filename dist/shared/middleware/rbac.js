export function requireRole(roles) {
    return (req, res, next) => {
        const user = req.user;
        if (!user || !roles.includes(user.role)) {
            return res.status(403).json({ code: 'FORBIDDEN', message: 'Insufficient permissions' });
        }
        next();
    };
}
