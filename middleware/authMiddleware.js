import jwt from 'jsonwebtoken';

// Authenticate Token Middleware.
// It will be applies to routes that require the user to be logged in.
export function authenticateToken(req, res, next) {
  // Extracting the token from the `Authorization` header.
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  try {
    // Verifying the token if it is valid or not.
    const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedPayload;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
}

// Authorize Token Middleware.
// Ensures that the authenticated user has the necssary permissions to
// access the resource (e.g. Routes that require specific user roles).
export function authorizeToken(roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access Denied' });
    }
    next();
  };
}
