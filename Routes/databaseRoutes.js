var express = require('express');
var router = express.Router();
var dbService = global.dbService;

const dbKey = process.env.DB_KEY;

router.use((req,res,next) => {

    const databaseKey = req.headers['dbkey'];
    if (databaseKey == dbKey)
    {
        next();
    }
    else
        return res.json({ 'error': 'true', 'message': 'Cannot Access DB.' });
});

router.get('/allUsers', async (req, res) => {
    try {
        console.log(`Request executed by Process : ${process.pid}` );
        var rows = await dbService.getAllUsers();
        return res.status(200).json({ 'Registered Users': rows });
    }
    catch (err) {
        console.log(err);
        return res.status(400).json({ 'error': true, 'message' : err });
    }
});

router.get('/removeAllUsers', async (req, res) => {
    try {
        await dbService.DeleteAllRegisteredUsers();
        return res.status(200).json({ 'error': false });
    }
    catch (err) {
        console.log(err);
        return res.status(400).json({ 'error': true, 'message' : err });
    }
});

router.get('/deleteRegisterUserTable', async (req,res) => 
{
    await dbService.DeleteRegisterationTable();
    res.status(200).json({'message':'Table Deleted Successfully'});
});

module.exports = router;