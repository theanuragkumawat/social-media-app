// src/middlewares/error.middleware.js

const errorHandler = (err, req, res, next) => {
  // Check if the error has a status code and message from our custom ApiError class
  // Otherwise, default to a 500 Internal Server Error
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  
  // In development mode, you might want to send the stack trace as well
  const response = {
    success: false,
    message: message,
    // Only include stack trace in development
    // ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  };

  // Send the JSON response
  return res.status(statusCode).json(response);
};

export { errorHandler };