const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const logger = require('../logs/logger');

exports.generateToken = (user) => {
    return jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
};

exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            error: 'Missing or invalid token',
            redirectToLogin: true
        });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;

        if (req.params.userId && String(req.params.userId) !== String(decoded.userId)) {
            logger.warn(`User ID mismatch: token user ${decoded.userId}, requested user ${req.params.userId}`);
            return res.status(403).json({ error: 'Access denied: user ID mismatch' });
        }

        next();
    } catch (err) {
        logger.warn(`Token verification failed: ${err.message}`);

        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                error: 'Your session has expired. Please login again.',
                redirectToLogin: true
            });
        }

        return res.status(401).json({
            error: 'Invalid or expired token',
            redirectToLogin: true
        });
    }
};
