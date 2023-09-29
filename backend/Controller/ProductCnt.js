
const Product = require('../models/product')
const multer = require('multer')
const express = require('express');
const middleware = require('../helpers/MIddleware');
const addrouter = express.Router();
const upload = require('../helpers/MediaUpload')

const AddProduct=async(req, res)=>{

    const basepath = `${req.protocol}://${req.get('host')}/public/uplods/`
    const filename = req.file.filename;
    console.log(filename)
    let product = new Product({
        name: req.body.name,
        image:`${basepath}${filename}`,
        description: req.body.description,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
       
        
    })
    product = await product.save();
    if(!product) 
    return res.status(500).send('The product cannot be created')

    res.send(product);

}

const getproducts = async(req, res)=>{
    const order = await Product.find()
    
    if(!order) {
        res.status(500).json({success: false})
    } 
    res.send(order);
 }

module.exports = {
    getproducts,
    AddProduct
}