const express = require('express');
const router = express.Router();

const { requireSignin, isAdmin, isAuth } = require('../controllers/authController');
const {userById} = require('../controllers/userController');
const {create, productById, read, remove, update, list, listRelated, listCategories, listBySearch, photo, listSearch} = require('../controllers/productController');
 
//create product
router.post("/product/create/:userId", requireSignin, isAuth, isAdmin, create);

//get product
router.get('/product/:productId', read);

//delete sản phẩm
router.delete(
    "/product/:productId/:userId",
    requireSignin,
    isAuth,
    isAdmin,
    remove
);

//update product 
router.put(
    "/product/:productId/:userId",
    requireSignin,
    isAuth,
    isAdmin,
    update
);

router.param("userId", userById);
router.param("productId", productById);

router.get('/products', list);

router.get('/products/related/:productId', listRelated);

router.get('/products/categories', listCategories);
//search product
router.post("/products/by/search", listBySearch);
//list search
router.get('/products/search', listSearch);

router.get('/product/photo/:productId', photo);

module.exports = router;