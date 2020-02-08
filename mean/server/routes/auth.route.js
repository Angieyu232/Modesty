const express = require('express');
const asyncHandler = require('express-async-handler')
const passport = require('passport');
const userCtrl = require('../controllers/user.controller');
const authCtrl = require('../controllers/auth.controller');
const config = require('../config/config');

const router = express.Router();
module.exports = router;

router.post('/register', asyncHandler(register), login);
router.post('/login', passport.authenticate('local', { session: false }), login);
router.get('/me', passport.authenticate('jwt', { session: false }), login);
router.post('/newPassword', asyncHandler(newPassword), login);

async function register(req, res, next) {
  //console.log('In register: req.body: '+ JSON.stringify(req.body));
  let user = await userCtrl.insert(req.body);
  user = user.toObject();
  delete user.hashedPassword;
  req.user = user;
  next()
}

function login(req, res) {
  let user = req.user;

  let token = authCtrl.generateToken(user);
  res.json({ user, token });
}

async function newPassword(req, res, next) {
  console.log('newpass receives req.body:' + req.body);
  let user = await userCtrl.updatePassword(req.body);
  user = user.toObject();
  //console.log('db return from nP-findOneAndUpdate: '+ JSON.stringify(user));
  delete user.hashedPassword;
  //req.user is newly defined here?
  req.user = user;
  next()

}
