const express = require('express')
const routers = express.Router();
const middleware = require('./helpers/MIddleware')
const {login, register, usercount, getLoggedInUser, updateUsers} = require("./Controller/UserControler")
const {getOrderitems, additems,getOrders,updateOrderstatus, deleteOrderstatus } = require("./Controller/OrderCnt")
const {addProduct, getproducts} = require('./Controller/ProductCnt')
// user login routes
routers.get('/', (req, res)=> res.send("i am live always "))
routers.post('/register',register)
routers.post('/login', login)
routers.get('/getuser',middleware,  getLoggedInUser)
routers.put('/toggleuser/:id',  updateUsers)

// Product Routes

routers.post("/item",middleware, addProduct)
routers.get("/getitems",middleware, getproducts)
// Order Routes

routers.post("/order", middleware, additems)
routers.get("/orderlist", middleware, getOrderitems)
routers.get("/getorder/:id", middleware, getOrders)
routers.put("/status/:id", middleware, updateOrderstatus)
routers.delete("/delete/:id", middleware, deleteOrderstatus)


module.exports = routers