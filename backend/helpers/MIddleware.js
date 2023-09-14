const jwt = require('jsonwebtoken');
const  Users  = require('../models/user')
const config = require('../Config');

async function middleware(req, res, next) {
    const authorization = req.headers['authorization'];

    if (authorization) {

        // validate the tokena

        const token = authorization.split(' ').pop();
        
        if(token) {

            try {
                jwt.verify(token, config.Secret_key);
    
                let user = jwt.decode(token);
                user = await Users.findById(user._id);
    
                user = user.toJSON();
                delete user.password;
    
                // Modify the request object to contain the authenticated user
                req.user = user;
    
                next();
            } catch(err) {
                return res.status(401).send({
                    message: 'Invalid token provided'
                })
            }

        } else {
            return res.status(401).send({
                message: 'No auth token present'
            })
        }

    } else {
        return res.status(401).send({
            message: 'User is not logged in'
        })
    }
}

module.exports = middleware;