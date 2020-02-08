const express = require('express');
const passport = require('passport');
//asyncHandler is a middleware for handling exceptions inside
// async express routes and pass them to express error handler

const asyncHandler = require('express-async-handler');
const userCtrl = require('../controllers/user.controller');

const router = express.Router();
module.exports = router;

//comment out for testing
router.use(passport.authenticate('jwt', { session: false }))

router.post('/deleteAcct/:email', asyncHandler(deleteAcct));

router.post('/setLimit', asyncHandler(setLimit));

router.get('/getLimit', asyncHandler(getTimer));
router.post('/recordTimeStamp', asyncHandler(setTimeStamp));
router.get('/isLimitExceed/:email', asyncHandler(isLimitExceed));

//async setter for timer
async function setLimit(req, res) {
  //extract req.body
  //acess to DB
  //console.log('In user.route.js async func setLimit');
  //console.log('req.body: '+ JSON.stringify(req.body));
  let result = await userCtrl.setLimit(req.body.email, req.body.timeLimit);
  //console.log('user.route.setLimit:result = '+result);
  res.status(200).send({"msg":result});
}


async function setTimeStamp(req, res){
  console.log(req.body.email);
  let result = await userCtrl.setTimeStamp(req.body.email, req.body.timeStamp);
  res.status(200).send({"msg":result});
}

async function isLimitExceed(req, res){
  const email = req.params.email;
  let result = await userCtrl.isLimitExceed(email);
  console.log('in User route, isLimitExceed result = '+result)
  res.status(200).send({"msg":result});
}

async function deleteAcct(req, res){
  //console.log('inside user root -deleteAcct')
  const email = req.params.email;
  let result = await userCtrl.deleteAcct(email);
  res.status(200).send({"msg": "account deleted!"});
}

//async getter for timer
async function getTimer(req, res) {
  let promise = await userCtrl.getTimer(req.body.email);
  //send back timer in minutes
  console.log('getTimer: '+ promise);
  res.json(promise);
}
