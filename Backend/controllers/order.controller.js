const User = require("../models/user.model")
const Order = require("../models/order.model")
const Product = require('../models/product.model')
const {createInvoiceMessage, sendMail} = require("../service/mail.service.js")
const {asyncHandler} = require("../utils/asyncHandler.js")
const {ApiResponse} = require("../utils/ApiResponse.js")
const {ApiError} = require("../utils/ApiError.js")

const getCartProductId = (item) => item.product?._id || item.product

const calculateOrderTotals = (cart) => {
  const totalAmount = cart.reduce((acc, curr) => {
    return acc + Math.floor(((100 - curr.product.discountPercentage) / 100) * curr.product.price) * curr.quantity
  }, 0)

  const totalItems = cart.reduce((acc, curr) => acc + curr.quantity, 0)
  return { totalAmount, totalItems }
}

const buildOrder = (orderDetails, userId, fetchedUser) => {
  const { totalAmount, totalItems } = calculateOrderTotals(fetchedUser.cart)

  return {
    user: userId,
    items: fetchedUser.cart.map((item) => ({
      product: getCartProductId(item),
      quantity: item.quantity,
      color: item.color,
      colorCode: item.colorCode,
      size: item.size,
    })),
    phoneNumber: orderDetails.phoneNumber,
    address: fetchedUser.address[orderDetails.addressIndex],
    paymentMethod: orderDetails.paymentMethod,
    totalAmount,
    totalItems,
    billingName: orderDetails.fullName,
    email: orderDetails.email,
  }
}

const updateStock = async (cart) => {
  for (const item of cart) {
    const product = await Product.findById(getCartProductId(item))
    if (!product) {
      throw new ApiError(500, "Product not found")
    }

    let stockUpdated = false

    for (const variation of product.variations) {
      if (variation.size === item.size) {
        for (const color of variation.colors) {
          if (color.color === item.color) {
            if (color.stock < item.quantity) {
              throw new ApiError(500, `Insufficient stock: ${color.stock} left`)
            }

            color.stock -= item.quantity
            product.stock -= item.quantity
            stockUpdated = true
          }
        }
      }
    }

    if (!stockUpdated) {
      throw new ApiError(500, "Product variation not found")
    }

    await product.save()
  }
}

// API
const createOrder = asyncHandler(async (req, res, next) => {
  const { id: userId } = req.body.user;
  const { orderDetails } = req.body;
  const { addressIndex, paymentMethod, email, fullName, phoneNumber } = orderDetails;

  if (addressIndex === undefined || !paymentMethod || !email || !fullName || !phoneNumber) {
    return next(new ApiError(400, "Insufficient data"));
  }

  const userBeforeOrder = await User.findById(userId).populate("cart.product");
  if (!userBeforeOrder?.cart?.length) {
    return next(new ApiError(400, "Cart is empty"));
  }

  try {
    if (userBeforeOrder.address?.[addressIndex] === undefined) {
      return next(new ApiError(400, "Address not found"));
    }

    await updateStock(userBeforeOrder.cart);
    const newOrder = await Order.create(buildOrder(orderDetails, userId, userBeforeOrder));
    const orderItems = userBeforeOrder.cart;

    userBeforeOrder.orderHistory = [newOrder._id, ...userBeforeOrder.orderHistory];
    userBeforeOrder.cart = [];
    await userBeforeOrder.save({ validateBeforeSave: false });

    if (process.env.MAIL_ID && process.env.MAIL_PASSWORD) {
      try {
        const populatedOrder = await Order.findById(newOrder._id).populate({
          path: "items.product",
          select: "title price discountPercentage",
        });
        const html = createInvoiceMessage({
          order: populatedOrder,
          orderId: newOrder._id,
        });
        await sendMail({
          html,
          to: userBeforeOrder.email,
          subject: "Invoice Details",
          text: "Invoice",
        });
      } catch (mailError) {
        console.log("Order confirmation email failed:", mailError.message);
      }
    }

    return res.status(200).json(new ApiResponse(200, "Order created successfully", { newOrderId : newOrder._id, orderItems }));

  } catch (error) {
    console.log({error})
    return next(error);
  }
});




const fetchUserOrders = asyncHandler(async(req,res,next)=>{
 
      const {id : userId} =  req.body.user
      
      const fetchedUser = await User.findById(userId).populate({
            path: 'orderHistory',
            populate: {
              path: 'items.product',
              select:"-reviews -rating -images -deleted -stock -variations -__v "
              }
            })
      if(! fetchedUser ){
          return next(new ApiError(400,"User not found"))
      }

      const orders = fetchedUser.orderHistory
      return res.status(200).json(new ApiResponse(200,"Orders fetched Successfully",orders))
     
})

const fetchAllOrders = asyncHandler(async(req,res,next)=>{
 
    let query = Order.find().populate({
      path:"items.product"
    })
    let totalOrdersQuery = Order.find()

    if(req.query._sort){
      query = query.sort({[req.query._sort] : parseInt(req.query._order ) || 1})
    }

    const page =  parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 15

    query = query.skip( (page -1) * limit ).limit(limit)
    const totalOrders = await totalOrdersQuery.countDocuments()
    const orders = await query.exec();
    
    return res.status(200).json(new ApiResponse(200,"Successfully fetched orders", {totalOrders ,orders}))
  }
)

const fetchOrderById = asyncHandler(async(req,res,next)=>{
    const {orderId} = req.params
    if(!orderId){
      return next(new ApiError(400,"Order Id not found"))
    }

    const order = await Order.findById(orderId).populate({
      path:"items.product"
    })

    if(!order){
      return next(new ApiError(400,`No Order found with OrderID ${orderId}`))
    }
    return res.status(200).json(new ApiResponse(200,"Order fetched successfully",order)) 


})

const updateOrder = asyncHandler(async(req,res,next)=>{
  

    const { updatedOrderDetails } = req.body
    const {orderId} = req.params
    if(!orderId){
      return next(new ApiError(400,"Order Id not found"))
    }

    const updatedOrder = await Order.findByIdAndUpdate(orderId , {...updatedOrderDetails},{new:true})
    if(!updatedOrder){
      return next(new ApiError(400,`No Order found with OrderID ${orderId}`))
    }

    return res.status(200).json(new ApiResponse(200,"Order Updated successfully"))

})

module.exports = {
    createOrder , 
    fetchUserOrders,
    fetchAllOrders,
    fetchOrderById,
    updateOrder
}