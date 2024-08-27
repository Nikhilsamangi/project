const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const UserModel = require("../models/userModel");

const validateToken = asyncHandler(async (req, res, next) => {
  try {
    const token = req.header('authToken');
    if (!token) {
      return res.status(401).send({ status: false, message: "TOKEN_NOT_FOUND" });
    }

    const decodedTokenData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);
    const { id, role } = decodedTokenData;

    if (!id) {
      return res.status(401).send({ status: false, message: "INVALID_TOKEN_CONTENT" });
    }

    const userData = await UserModel.findOne({ _id: id });

    if (!userData) {
      return res.status(403).send({ status: false, message: "UNAUTHORISED_USER" });
    }

    // Attach user data to request object for further use in route handlers
    req.user = decodedTokenData;
    
    next();
  } catch (exception) {
    console.error('Token validation error:', exception);
    res.status(401).send({ status: false, msg: "INVALID_TOKEN" });
  }
});

module.exports = validateToken;
