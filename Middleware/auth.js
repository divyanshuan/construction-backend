const { verifyToken } = require("../utils/AuthJWT");

module.exports = (req, res, next) => {
  const token = req.cookies.token; // or req.headers.authorization?.split(" ")[1]

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(403).json({ message: "Token is not valid" });
  }

  req.user = decoded;
  next();
};
