// generate token using secret from process.env.JWT_SECRET
'use strict';

var jwt = require('jsonwebtoken');

module.exports = class JWTokenService 
{
    generateToken(user) {
        if (!user) return null;

        var payload = {
            emailId: user.emailId,
            displayName: user.displayName,
            isAdmin: user.isAdmin
        };        

        return jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: 60 * 60 * 1  // expires in 24 hours
        });
    }

    async verifyToken(token, callback)
    {
        try
        {
            jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
                callback(err, user);
            });
        }
        catch(error)
        {

        }
    }
}
