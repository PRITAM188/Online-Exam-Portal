require('dotenv').config();

const auth = (roles = []) => {
    return (req, res, next) => {
        try {
            const userId = req.headers['user-id'];
            const userRole = req.headers['user-role'];

            if (!userId) {
                return res.status(401).json({ message: 'Unauthorized: No user ID provided' });
            }

            if (roles.length > 0 && !roles.includes(userRole)) {
                return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
            }

            req.user = {
                id: userId,
                role: userRole
            };

            next();
        } catch (err) {
            console.error('Authentication error:', err);
            res.status(500).json({ message: 'Authentication failed' });
        }
    };
};

module.exports = auth;