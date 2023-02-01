const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ItemSchema = new Schema({
    DSIN: {
        type: String,
        required: true
    },
    NAME: {
        type: String,
        required: true
    },
    MRP: {
        type: Number,
        required: true
    },
    HSN_CODE: {
        type: Number,
        required: true
    },
    GST: {
        type: String,
        required: true
    }
})  

const Item = mongoose.model('Item', ItemSchema)
module.exports = Item