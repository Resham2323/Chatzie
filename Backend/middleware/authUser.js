import jwt from "jsonwebtoken";

export const authUser = (req, res, next) => {
    try {

        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ error: "No token provided" });
        }

        console.log("TOKEN:", token);

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        req.user = { _id: decoded.user };

        console.log("USER ID:", req.user._id);

        next();

    } catch (err) {
        console.log("error in protecting middleware", err);
        res.status(401).json({ error: "Invalid token" });
    }
};