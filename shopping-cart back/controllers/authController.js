const User = require('../models/userModel');
const {errorHandler} = require('../helpers/dbErrorHandler');
const jwt = require('jsonwebtoken');  // generate new token 
const expressJwt = require('express-jwt'); // authorization check 

exports.signup = (req, res) => {
    console.log("req.body ", req.body);
    const user = new User(req.body)
    user.save((err, user) => {
      if(err) {
          return res.status(400).json({
            err: errorHandler(err)
          });
      } 
      user.salt = undefined;
      user.hashed_password = undefined;
      res.json({
          user
      })
    })
}

exports.signin = (req, res) => {
  //find the user based on email 
  const {email, password} = req.body;
  User.findOne({email}, (err, user) => {
      if( err || !user) {
        return res.status(400).json({
          err: "Email does not exit"
        });
      }
      //if user is found 
      if(!user.authenticate(password)) {
        return res.status(401).json({
          err: 'email or password dont match'
        })
      }

      const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET);
      res.cookie('t', token, {expire: new Date() + 9999});
      //return response with user and token to frontend client
      const {_id, name, email, role} = user
      res.json({token, user: {_id, name, email, role}});
  });
}

exports.signout = (req, res, next) => {
  res.clearCookie('t');
  res.json(
    {
      message: 'Sign out success' 
    }
  )
}

exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"], // added later
  userProperty: "auth",
}); 

exports.isAuth = (req, res, next) => {
  let user = req.profile && req.auth && req.profile._id == req.auth._id;
  if(!user) {
    return res.status(403).json({
      error: 'Access denied'
    })
  }
  next();
};

exports.isAdmin = (req,res,next) => {
  if(req.profile.role === 0) {
    return res.status(403).json({
      error: 'Admin resource! Access denied'
    });
  }
  next();
}