const express = require('express')
const router = express.Router()
const createError = require('http-errors')

const {itemSchema} = require('../helpers/validation_schema')
const Item = require('../models/Items.model')
const { verifyAccessToken } = require('../helpers/jwt_helper')
const Order = require('../models/Orders.model')
const UserOrder = require('../models/UserOrders.model')


router.get('/get-items', async (req,res,next)=>{
    try {
        const items = await Item.find({})
        res.json(items)
    }   
    catch (error) {
        next(error)    
    }
})

router.post('/make-order', verifyAccessToken,  async(req,res,next)=>{
    try {
        const { aud: userID } = req.payload
        const order = new Order(req.body)
        const newOrder = await order.save();

        const user = await UserOrder.findOne({userID})
        if(user){
            await UserOrder.updateOne({userID}, {$push: {orders: newOrder.id}})
        }
        else{
            const userOrder = new UserOrder({userID, orders: [newOrder.id]})    
            const newUserOrder = await userOrder.save()
        }

        res.status(200).send("Order succefully added")
    }
    catch (error) {
        next(error)
    }
})

router.get('/user-orders', verifyAccessToken, async (req, res, next)=>{
    try {
        const { aud: userID } = req.payload
        const { orders } = await UserOrder.findOne({userID}).populate({
            path: 'orders',
            populate: {
                path: 'itemCount.itemId',
                model: 'Item'
            }
        })
        res.json(orders)
    }
    catch (error) {
        next(error)    
    }
})


router.post('/add-item', async (req, res, next)=>{
    try {
        const result = await itemSchema.validateAsync(req.body)
        const item = new Item(result)
        const savedItem = await item.save()
        res.status(200).send('Item added succefully')
    } catch (error) {
        next(error)
    }
})

// const response = []
// for(order of orders){
//     let oneOrder = {}
//     oneOrder.orderId = order.id
//     oneOrder.items = []
//     for(item of order.itemCount){
//         let oneItem = {}
//         oneItem.NAME = item.itemId.NAME
//         oneItem.quantity = item.quantity
//         oneOrder.items.push(oneItem)
//     }
//     response.push(oneOrder)
// }
// res.json(response)

module.exports = router