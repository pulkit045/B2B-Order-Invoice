const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserOrderSchema = new Schema({
    userID: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User'
    },
    orders: [
        {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Order'
        }
    ]
})  

const UserOrder = mongoose.model('UserOrder', UserOrderSchema, 'user_orders')
module.exports = UserOrder