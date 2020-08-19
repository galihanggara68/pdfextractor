var express = require('express');
var router = express.Router();
const createError = require("http-errors");

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
var config = {"secret": process.env.JWT_SECRET};

const Users = require("../dataaccess/users");
const userDa = new Users();

router.post('/register', function(req, res) {
  var hashedPassword = bcrypt.hashSync(req.body.password, 8);
  
  userDa.insert({name: req.body.name, username: req.body.username, password: hashedPassword}).then(() => {
    res.status(200).json({name: req.body.name, username: req.body.username, password: hashedPassword});
  }).catch(err => next(createError(500)));
});

router.post('/login', function(req, res, next) {

  userDa.getOne({usernamew: req.body.username}).then(user => {
    if(!user) return res.status(404).send('No user found.');
    console.log(user);
    var passwordValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordValid) return res.status(401).send({ auth: false, token: null });
    
    var token = jwt.sign({ id: user.user_id }, config.secret, {
      expiresIn: process.env.JWT_EXPIRES
    });
    
    res.status(200).send({ auth: true, token: token });
  }).catch(err => next(createError(500)));
  
});

module.exports = router;
