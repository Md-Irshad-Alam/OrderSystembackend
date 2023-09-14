
const Product = require('../models/product')

const addProduct = async(req, res)=>{
    let product = new Product({
        name: req.body.name,
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
    addProduct,
    getproducts
}