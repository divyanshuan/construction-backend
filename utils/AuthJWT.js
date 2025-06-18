const jwt = require("jsonwebtoken");

exports.generateToken = (user) => {
  return jwt.sign(
    { user_id: user.user_id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

exports.verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null;
  }
};
