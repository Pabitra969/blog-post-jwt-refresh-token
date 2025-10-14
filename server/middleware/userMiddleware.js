const jwt = require('jsonwebtoken');
const User = require('../models/user')
const dotenv = require('dotenv');
dotenv.config();

const userMiddleware = async (req, res, next) => {

  // const authHeader = req.headers['authorization'];
  // console.log("Auth Header: ", authHeader);

  // if(!authHeader || !authHeader.startsWith('Bearer ')) return res.status(405).json({
  //   message : "No token provided"
  // })

  // try {
  //   const token = req.cookies.token;
  //   console.log("Token from cookie: ", token);

  //   if(!token) return res.status(403).json({
  //     message : "Unauthorised"
  //   })

  //   const decoded = jwt.verify(token, process.env.JWT_SECRET);
  //   console.log("Decoded Token: ", decoded);
  //   req.user = await User.findById(decoded.id);
  //   next();
  // } catch (error) {
  //   return res.status(404).json({
  //     message : "Unathorised"
  //   })
  // }

  const authHeader = req.headers['authorization'];
  console.log("Auth Header: ", authHeader);
  
  if(!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({
    message : "No token provided"
  })
  
  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token: ", decoded);
    req.user = await User.findById(decoded.id);
    console.log("User from middleware: ", req.user);
    next();
  } catch (error) {
    res.status(403).json({
      message : "Unauthorised"
    })
  }

}

module.exports = userMiddleware;