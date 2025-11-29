export const protectedRoute = async (req, res, next) => {
    const isAuthenticated = req.auth().isAuthenticated;
    if (isAuthenticated) {
        next();
    }
    else {
        res.status(401).json({ message: "Unauthorized - you must be logged in" });
    }
};
