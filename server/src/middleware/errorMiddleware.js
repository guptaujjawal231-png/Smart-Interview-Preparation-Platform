/**
 * 404 Route Not Found Middleware
 */
export const notFound = (req, res, next) => {
  const error = new Error(`Route Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Centralized Global Error Handler Middleware
 */
export const errorHandler = (err, req, res, next) => {
  // If status is still 200 OK, default to 500 Internal Server Error
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'An unexpected server error occurred',
    // Only reveal stack trace in development mode for debugging
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};
