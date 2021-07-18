const formidable = require('formidable');
const _ = require('lodash');
const Product = require('../models/productModel');
const {errorHandler} = require('../helpers/dbErrorHandler');
const fs = require('fs');
const { find } = require('../models/productModel');

exports.create = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Image could not be uploaded'
            });
        }
        //check for all fields
        const { name, description, price, category, quantity, shipping } = fields;

        if (!name || !description || !price || !category || !quantity || !shipping) {
            return res.status(400).json({
                error: 'All fields are required'
            });
        }

        let product = new Product(fields);

        if (files.photo) {
            console.log("FILES PHOTO: ", files.photo);
            if (files.photo.size > 1000000) {
                return res.status(400).json({
                    error: 'Image should be less than 1mb in size'
                });
            }
            product.photo.data = fs.readFileSync(files.photo.path);
            product.photo.contentType = files.photo.type;
        }

        product.save((err, result) => {
            if (err) {
                console.log('PRODUCT CREATE ERROR ', err);
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            return res.json(result);
        });
    });
};

exports.productById = (req, res, next, id) => {
    Product.findById(id).exec((err, product) => {
        if(err) {
            return res.status(400).json({
                err: "Product not found"
            })
        }
        req.product = product; 
        next();
    })
}


exports.read = (req, res) => {
    req.product.photo = undefined;
    return res.json(req.product);
}

exports.remove = (req, res) => {
    let product = req.product;
    product.remove((err, deletedProduct) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({
            message: 'Product deleted successfully'
        });
    });
};



exports.update = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Image could not be uploaded'
            });
        }

        let product = req.product;
        product = _.extend(product, fields);
        

        if (files.photo) {
            // console.log("FILES PHOTO: ", files.photo);
            if (files.photo.size > 1000000) {
                return res.status(400).json({
                    error: 'Image should be less than 1mb in size'
                });
            }
            product.photo.data = fs.readFileSync(files.photo.path);
            product.photo.contentType = files.photo.type;
        }

        product.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(result);
        });
    });
};


/* sell/arrival
    by sell = /products?sortBy=sold&order=desc&limit=4
    by arrival = /products?sortBy=createdAt&order=desc&limit=4
    if no params are sent
*/

exports.list = (req,res) => {
    let order = req.query.order ? req.query.order : 'asc';
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
    let limit = req.query.limit ? parseInt(req.query.limit) : 6;
    Product
        .find()
        .select("-photo")
        .populate('category')
        .sort([[sortBy, order]])
        .limit(limit)
        .exec((err,data) => {
            if(err) {
                return res.status(400).json({
                    error: 'Products not found'
                })
            }
            res.send(data)
        } )
}


exports.listRelated = (req,res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 4;
    Product.find({_id:{$ne: req.product}, category: req.product.category })
        .limit(limit)
        .populate('category', '_id name ')
        .exec((err,products) => {
            if(err) {
                return res.status(400).json({
                    error: 'Products not found '
                })
            }
            res.json(products);
        })
}

exports.listCategories = (req, res) => {
    Product.distinct('category', {}, (err, categories) => {
        if(err) {
            return res.status(400).json({
                error: 'Products not found'
            })
        }
        res.json(categories);
    })
};
// search product
exports.listBySearch = (req, res) => {
    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);
    let findArgs = {};

    // console.log(order, sortBy, limit, skip, req.body.filters);
    // console.log("findArgs", findArgs);

    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === "price") {
                // gte -  greater than price [0-10] 
                // lte - less than
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                };
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }

    Product.find(findArgs)
        .select("-photo")
        .populate("category")
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: "Products not found"
                });
            }
            res.json({
                size: data.length,
                data
            });
        });
};

exports.photo = (req, res, next) => {
    if (req.product.photo.data) {
        res.set('Content-Type', req.product.photo.contentType);
        return res.send(req.product.photo.data);
    }
    next();
};

exports.listSearch = (req,res) => {
    //tạo query object để lưu giữ giá trị search value và category value 
    const query = {};

    if(req.query.search) {
        query.name={$regex: req.query.search, $options: 'i'};
        if(req.query.category && req.query.category != 'All') {
            query.category = req.query.category;
        }
        //find product based on query with 2 properties 
        Product.find(query, (err, products) => {
            if(err) {
                return res.status(404).json({
                    error: errorHandler(err)
                })
            }
            res.json(products);
        }).select('-photo')
    }
}


//link tham khảo https://docs.mongodb.com/manual/reference/method/db.collection.bulkWrite/
exports.decreaseQuantity = (req, res, next) => {
    let bulkOps = req.body.order.products.map(item => {
        return {
            updateOne: {
                filter: { _id: item._id },
                update: { $inc: { quantity: -item.count, sold: +item.count } }
            }
        };
    });

    Product.bulkWrite(bulkOps, {}, (error, products) => {
        if (error) {
            return res.status(400).json({
                error: 'Could not update product'
            });
        }
        next();
    });
};