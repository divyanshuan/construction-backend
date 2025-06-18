module.exports = {
  httpOnly: true,
  secure: false, // Set true in production
  sameSite: "strict",
  maxAge: 24 * 60 * 60 * 1000, // 1 day
};
