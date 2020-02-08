const bcrypt = require('bcrypt');
const Joi = require('joi');
const User = require('../models/user.model');


const userSchema = Joi.object({
  fullname: Joi.string().required(),
  email: Joi.string().email(),
  mobileNumber: Joi.string().regex(/^[1-9][0-9]{9}$/),
  password: Joi.string().required(),
  repeatPassword: Joi.string().required().valid(Joi.ref('password'))
})


module.exports = {
  insert,
  getLimit,
  setLimit,
  deleteAcct,
  updatePassword,
  setTimeStamp,
  isLimitExceed
}

async function insert(user) {
  user = await Joi.validate(user, userSchema, { abortEarly: false });
  user.hashedPassword = bcrypt.hashSync(user.password, 10);
  delete user.password;
  return await new User(user).save();
}

async function setTimeStamp(email, timeStamp){
//record timestamp on DB
  return new Promise((resolve, reject) => {
    User.findOneAndUpdate({email: email}, { $set: {timeStamp: timeStamp}}, (err, data)=>{
      if (err) { console.error(err) }
      else {
        console.log('DB returns: '+ data.toObject());
        resolve("record TimeStamp Success");
      }
    })
  });
}

async function isLimitExceed(email){
  let promise1 =  new Promise((resolve, reject) => {
    User.findOne({email: email}, (err, data)=>{
      if (err) { console.error(err) }
      else {
        console.log('find user in DB');
        resolve(data);
      }
    })
  });

  return promise1.then((data)=> {
    if( data != null ){
      let user = data.toObject();
      if(user.timeStamp != undefined || user.timerStamp != null){
        let interval = ((new Date()).getTime()- user.timeStamp)/(3600000);
        //get interval in minutes
        if( interval < 1440 ){
         console.log('One day not passed, limit is exceed');
        return(true);
        } else { return(false)}
      }
    }
  });
}


async function updatePassword(reqbody){
  let email = reqbody.email;
  let newPass = reqbody.password;
  let hashedPass = bcrypt.hashSync(newPass, 10);
  console.log('New Hashedpass: '+ hashedPass);
  return new Promise((resolve, reject) => {
    User.findOneAndUpdate({email: email}, { $set: {hashedPassword: hashedPass}}, (err, data)=>{
      if (err) { console.error(err) }
      else { resolve(data);}
    })
  })
}

async function getLimit(email) {
  return new Promise((resolve, reject) => {
    User.findOne({email: email}, (err, user)=>{
      if (err){
        console.error(err);
      }
      else{
        resolve(user.timeLimit);
      }
    })
  });
}

async function deleteAcct(email){
  return new Promise((resolve, reject) => {
    User.findOneAndRemove({email: email}, (err, data) => {
      if (err){
        console.error(err);
        reject(err);
      } else {
        resolve(data);
      }
    })

  })
}



async function setLimit(email, min){
  console.log('in user.controller setLimit(), email: '+ email + ' min: '+ min);

  //saveToMongodb
  return new Promise((resolve, reject) => {
    User.findOneAndUpdate({email: email}, { $set: { timeLimit: min }}, msg => {
      console.log('mongoose cb msg: '+msg);
      resolve('update db success');
      })
      .catch(err => {console.error(err)});
  })




}
