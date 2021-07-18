const {Order, CartItem} = require('../models/orderModel');
const {errorHandler} = require('../helpers/dbErrorHandler');
const User = require('../models/userModel');

exports.create = (req, res) => {
    req.body.user = req.profile ;
    req.body.order.userInfo = { userId: req.profile._id, userName: req.profile.name };
    const order = new Order(req.body.order);
    order.save((error, data) => {
        const resData = {...data, nameUser : req.profile.name}
        if(error) {
            return res.status(400).json({
                error: errorHandler(data)
            })
        }
        res.json(resData);
    })
}


exports.listOrders = (req, res) => {
    Order.find()
        .populate('user', '_id name address')
        .sort('-created')
        .exec((err, orders) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            console.log(orders);
            res.json(orders);
        });
};

exports.getStatusValues = (req,res) => {
    //send values to front end
    res.json(Order.schema.path('status').enumValues)
}

exports.orderById = (req, res, next, id) => {
    Order.findById(id)
        .populate('products.product', 'name price')
        .exec((err, order) => {
            if(err || !order) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            req.order = order ;
            next();
        })
}


exports.updateStatusValues = (req, res) => {
    Order.update({ _id: req.body.orderId }, { $set: { status: req.body.status } }, (err, order) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(order);
    });
};
