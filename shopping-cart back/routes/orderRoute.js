const express = require('express');
const router = express.Router();

const { requireSignin, isAdmin, isAuth } = require('../controllers/authController');
const {userById, addOrderToUserHistory} = require('../controllers/userController');
const {create, listOrders,getStatusValues, orderById, updateStatusValues} = require('../controllers/orderController');
const {decreaseQuantity} = require('../controllers/productController');

// tạo order 
router.post(
    "/order/create/:userId",
    requireSignin,
    isAuth,
    addOrderToUserHistory,
    decreaseQuantity,
    create
);


router.get("/order/list/:userId", requireSignin, isAuth, isAdmin, listOrders);

router.get('/order/status/:userId', requireSignin, isAuth, isAdmin, getStatusValues);
//update status method
router.put('/order/:orderId/status/:userId', requireSignin, isAuth, isAdmin, updateStatusValues);

router.param('orderId', orderById);

router.param("userId", userById);

module.exports = router