export const errorHandler = (err, _req, res, _next) => {
    console.error("Error:", err);
    const statusCode = err.statusCode || err.status || 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({
        status: "error",
        message,
    });
};
