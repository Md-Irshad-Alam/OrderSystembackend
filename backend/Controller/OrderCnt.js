
const Order = require('../models/order');
const { OrderItem } = require('../models/order-item');

const getOrderitems = async(req,res)=>{
    const orderList = await Order.find().populate('user',"name" ).sort({'dateOrdered': -1})
    .populate({ 
        path: 'orderItems', populate: {
            path : 'product'} 
        });

    if(!orderList) {
        res.status(500).json({success: false})
    } 
    res.send(orderList);

}
 const getOrders = async(req, res)=>{
    const order = await Order.findById(req.params.id).populate('user',"name" )
    .populate({ 
        path: 'orderItems', populate: {
            path : 'product'} 
        });

    if(!order) {
        res.status(500).json({success: false})
    } 
    res.send(order);
 }

 const updateOrderstatus = async(req, res)=>{
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            {
                status: req.body.status
            },{new:true}
        )
        if(!order) {
            res.status(500).json({success: false})
        } 
        res.send(order);
 }


 
 const deleteOrderstatus = async(req, res)=>{
    Order.findByIdAndRemove(req.params.id).then(async order =>{
        if(order) {
            await order.orderItems.map(async orderItem => {
                await OrderItem.findByIdAndRemove(orderItem)
            })
            return res.status(200).json({success: true, message: 'the order is deleted!'})
        } else {
            return res.status(404).json({success: false , message: "order not found!"})
        }
    }).catch(err=>{
       return res.status(500).json({success: false, error: err}) 
    })
 }



const additems = async(req,res)=>{
    const orderitemsid =Promise.all(req.body.orderItems.map(async(order) =>{
        let neworderitem = new OrderItem({
            quantity:order.quantity,
            product:order.product
        })
        neworderitem = await neworderitem.save()
        return neworderitem._id;
    }))
    const OrderId = await orderitemsid;
    const totalPrices = await Promise.all(OrderId.map(async (orderItemId)=>{
        const orderItem = await OrderItem.findById(orderItemId).populate('product', 'price');
      
        const totalPrice = orderItem.product.price * orderItem.quantity;
        return totalPrice
    }))
    const totalPrice = totalPrices.reduce((a,b) => a +b , 0);
    console.log(OrderId)
    let order = new Order({
        orderItems: OrderId,
        shippingAddress1: req.body.shippingAddress1,
        country:req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        user: req.body.user,
        totalPrice:totalPrice,
    })
    console.log(order)
    order = await order.save();
    if(!order){
        return res.status(400).send("order not created ")
    }
    res.send(order)

}

module.exports = {
    additems,
    getOrderitems,
    getOrders,
    updateOrderstatus,
    deleteOrderstatus
}