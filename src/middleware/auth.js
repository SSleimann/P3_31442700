const User = require("../models/user");
const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) return res.sendStatus(403);

    try {
      const dbUser = await User.findByPk(user.sub);
      if (!dbUser) return res.sendStatus(403);
      req.user = dbUser;
      next();
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  });
};

module.exports = authenticateToken;
