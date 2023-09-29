const Order = require('../models/order');
const OrderItem  = require('../models/order-item');
const product = require('../models/product')
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
    
    const orderitemsid = Promise.all(req.body.orderItems.map(async (order) => {
        try {
          // Create a new order item
          var neworderitem = new OrderItem({
            quantity: order.quantity,
            product: order.product,
          });
         
          // Get the product by its ID
          const getproduct = await product.findById(order.product);
          
          // Check if there is enough stock to fulfill the order
          if (!getproduct || getproduct.countInStock < order.quantity) {
              console.log(`Insufficient stock to fulfill the order ${getproduct.countInStock}`)
           return res.status(301).send("Insufficient stock to fulfill the order");
          }else{
            const updatedQuantity = getproduct.countInStock - order.quantity;
            await product.findByIdAndUpdate(order.product, {
                countInStock: updatedQuantity,
            }, { new: true });
        
            console.log("Stock updated after order:", updatedQuantity);
        
            // Remove the product if the stock count goes negative (optional)
            if (updatedQuantity < 0) {
                await product.findByIdAndRemove(order.product);
            } else {
                // Save the new order item
              neworderitem =   await neworderitem.save();
            }
          }
      
          return neworderitem;
        } catch (error) {
            console.error(error);
            res.status(400).send(error.message)
          
        }
      }));
   
    var OrderId = await orderitemsid;
    let checkproduct = await product.findById(OrderId !=null && OrderId.map(ele => ele.product));


    if(checkproduct ==null){
        console.log( "product is not available ")
        return 
    }
    const totalPrices = await Promise.all(OrderId.map(async (orderItemId)=>{
        const orderItem = await OrderItem.findById(orderItemId._id).populate('product', 'price');
        if(OrderItem ==null){
           
            res.send("Product is avalibale ")
        }else{
            const totalPrice = orderItem.product.price * orderItem.quantity;
            return totalPrice
        }
        
    }))
    const totalPrice = totalPrices.reduce((a,b) => a +b , 0);
    


    let order = new Order({
        orderItems: OrderId,
        shippingAddress1: req.body.shippingAddress1,
        country:req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        user: req.body.user,
        totalPrice:totalPrice,
    })
    
   if(checkproduct.countInStock > 0){
    console.log(order)
        order = await order.save();
        if(!order){
            return res.status(400).send("order not created ")
        }
        res.send(order)
   }else{
   return res.send(" Order rejected due to Insufficient product")
   }
    
}

module.exports = {
    additems,
    getOrderitems,
    getOrders,
    updateOrderstatus,
    deleteOrderstatus
}