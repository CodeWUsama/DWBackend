const jwt = require("jsonwebtoken");

exports.isAuth = (req, res, next) => {
  const token = req.get("Authorization")?.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "wallet!");
  } catch (err) {
    return res.status(200).json({
      message: "Please login again.",
      error: true,
    });
  }
  if (!decodedToken) {
    return res.status(200).json({
      message: "Please login again.",
      error: true,
    });
  }
  req.username = decodedToken.username;
  next();
};
