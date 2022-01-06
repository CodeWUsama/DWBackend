const jwt = require("jsonwebtoken");

exports.isAuth = (req, res, next) => {
    const token = req.get("Authorization")?.split(" ")[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, "wallet!");
        req.username = decodedToken.username;
        req.userLevel = decodedToken.userLevel;
    }
    catch (err) {
        return res.status(500).json({ message: "Authentication Failed! Please login again." });
    }
    if (!decodedToken) {
        return res.status(500).json({ message: "Authentication Failed! Please login again." });
    }
    req.username = decodedToken.username;
    next();
}
