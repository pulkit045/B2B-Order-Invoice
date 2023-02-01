const mongoose = require('mongoose')
const Schema = mongoose.Schema

const OrderSchema = new Schema({
    itemCount: [
        {
            itemId: {
                type: mongoose.SchemaTypes.ObjectId,
                ref: 'Item'
            },
            quantity: {
                type: Number
            }
        }
    ]
})  

const Order = mongoose.model('Order', OrderSchema)
module.exports = Order