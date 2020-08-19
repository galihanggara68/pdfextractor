var jwt = require('jsonwebtoken');
var config = {"secret": process.env.JWT_SECRET};
const Users = require("../../dataaccess/users");
const createError = require('http-errors');
const userDa = new Users();

function verifyToken(req, res, next) {
    var token = req.headers['x-access-token'];
    if (!token){
        return res.status(403).send({ auth: false, message: 'No token provided.' });
    }

    try{
        let decoded = jwt.verify(token, config.secret);
        userDa.getOne({user_id: decoded.id}).then(user => {
            if(!user){
                return res.status(403).send({ auth: false, message: 'Unauthorized' });
            }
            next();
        }).catch(err => next(createError(500)));
    }catch(err){
        next(createError(500));
    }
}

module.exports = verifyToken;