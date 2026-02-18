export const requireRole = (...allowedRoles) => {
    return (req, res, next) => {

        if (!req.user) {
            return res.status(401).json({ message: "You must be logged in!" });
        }

        const hasPermission = allowedRoles.includes(req.user.role);

        if (!hasPermission) {
            return res.status(403).json({
                message: "Access denied! You don't have permission."
            });
        }

        next();
    };
};
