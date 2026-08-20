export const errorHandler = (err, _req, res, _next) => {
  const status = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  console.error(`[Error ${status}] ${message}`);

  res.status(status).json({
    success: false,
    message,
  });
};

export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}
