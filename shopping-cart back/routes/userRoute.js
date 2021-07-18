const express = require('express');
const router = express.Router();

const {userById, read, update} = require('../controllers/userController');
const {body, check} = require('express-validator/check');
const { requireSignin, isAdmin, isAuth } = require('../controllers/authController');

router.get('/secret/:userId', requireSignin, isAuth, isAdmin , (req, res) =>{
     res.json({
         user: req.profile
     })
})


router.get('/user/:userId', requireSignin, isAuth, read);
//update user 
router.put('/user/:userId', requireSignin,isAuth, update);

router.param('userId', userById);

module.exports = router;    