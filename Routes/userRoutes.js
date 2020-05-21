'use strict';
var express = require('express');
var router = express.Router();
var dbService = global.dbService;

var JWTokenService = require('../Services/tokenService'); //It it exporting a class called JWTokenService
var tokenService = new JWTokenService();        //Create an object of the exported class JWTokenService

router.use( (req,res,next) =>  
{    
    var token = req.headers['authorization'];

    if (!token) 
        return next();
    token = token.replace('Bearer ','');

    tokenService.verifyToken(token, (err, user) => 
    {
        if (err)
        {
            return res.status(401).json(
                {
                    'error' : true,
                    'message' : 'Invalid Token'
                }
            )
        }
        req.user = user;
        next();
    });
});

router.post('/register', async (req, res) => {
    
    const { emailid, pwd, displayname } = req.body;

    if (!emailid || !pwd || !displayname) {
        return res.status(400).json({
            'error': true,
            'message': 'Incomplete Info. Please provide valid EmailId, Password and DisplayName'
        });
    }

    var len = displayname.length
    if (len > 15) {
        return res.status(400).json({
            'error': true,
            'message': 'DisplayName cannot be more than 15 characters'
        });
    }

    const rows = await dbService.getUserFromEmailId(emailid);

    if (rows.length > 0) {
        return res.status(400).json({
            'error': true,
            'message': 'EmailId already exist.'
        });
    }

    await dbService.registerUser(emailid, pwd, displayname);

    return res.status(200).json({
        'error': false, 'message': 'User Registered Successfully'
    });
});


router.post('/signin', async (req, res) => {
    var { emailid, pwd } = req.body;

    if (!emailid || !pwd) {
        return res.status(400).json({
            'error': true,
            'message': 'Incomplete Info. Please provide valid EmailId, Password and DisplayName'
        });
    }

    const rows = await dbService.getUserFromEmailId(emailid);

    if (rows.length == 0) {
        return res.status(400).json({
            'error': true,
            'message': 'EmailId doesnt exist.'
        });
    }

    if (rows[0].password != pwd)
    {
        return res.status(400).json({
            'error': true,
            'message': 'Incorrect Password.'
        });
    }

    var user = { emailId : emailid, displayName: rows[0].displayname, isAdmin : false};
    var access_token = tokenService.generateToken(user);

    return res.status(200).json({
        'error': false, 'userInfo' : user, 'access_token' : access_token
    });
});

router.get('/welcome', (req,res) => {
    if (!req.user)
        return res.status(401).json( {'error' : true, 'message' : 'Invalid User, Please Login'});
    res.status(200).send(`Welcome  ${JSON.stringify(req.user)} !!`);
});

module.exports = router;