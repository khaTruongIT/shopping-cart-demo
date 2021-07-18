const express = require('express');
const router = express.Router();

const {signup, signin, signout, requireSignin} = require('../controllers/authController');
const {body} = require('express-validator');

router.post('/signup', (req,res) => {
    [
        body('name').notEmpty(),
        body('email')
            .isEmail()
            .normalizeEmail()
            .matches(/.+\@.+\..+/)
            .withMessage('Email must contain @')
            .isLength({
                min: 4, 
                max: 32 
             }),
        body('password', 'Password is required').notEmpty(),
        body('password')
            .isLength({min: 6})
            .withMessage('Password must contain at least 6 characters')
            .matches(/\d/)
            .withMessage('Password must contain a number')
    ]
    signup(req,res);
});

router.post("/signin", (req, res) => {
    signin(req,res);
});

router.get('/signout', (req, res) => {
    signout(req,res);
});


module.exports = router;     