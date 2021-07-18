const express = require('express');
const router = express.Router();
const { requireSignin, isAdmin, isAuth } = require('../controllers/authController');
const {create, categoryById, read, update, remove, list} = require('../controllers/categoryController');
const {userById} = require('../controllers/userController');
 
router.get('/category/:categoryId', read);

router.post('/category/create/:userId', requireSignin, isAuth, isAdmin ,create );
//Update category
router.put('/category/:categoryId/:userId', requireSignin, isAuth, isAdmin, update );
//Delete category
router.delete('/category/:categoryId/:userId', requireSignin, isAdmin, isAuth, remove);
//get list of categories
router.get('/categories', list);

router.param('categoryId', categoryById);

router.param("userId", userById);

module.exports = router;