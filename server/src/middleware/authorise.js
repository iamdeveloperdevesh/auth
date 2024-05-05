import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
    try {
        const authToken = req.headers.authorization || req.headers.Authorization;
        if (!authToken?.startsWith('Bearer ')) return res.status(401).send("Access Denied");
        const token = authToken.split(' ')[1];

        jwt.verify(
            token,
            process.env.JWT_SECRET,
            (err, decoded) => {
                if (err) {
                    verifyCookieToken(req, res, next);
                    return res.status(401).send("Access Denied");
                }
                req.body.UserId = decoded.id;
                next();
            }
        );

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const verifyCookieToken = async (req, res, next) => {
    const cookies = req.cookies;
    if (!cookies?.token) return res.status(401).json({ message: "Access Denied" });
    const token = cookies.token;

    jwt.verify(
        token,
        process.env.JWT_SECRET,
        async (err, decoded) => {
            if (err) return res.status(401).json({ message: 'Access Denied' });
            req.body.UserId = decoded.id;
            next();
        }
    )
};