const Joi = require('joi')

const authSchema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(6).required()
})

// const itemSchema = Joi.object({
//     DSIN: Joi.string().required(),
//     NAME: Joi.string().required(),
//     MRP: Joi.number().required(),
//     HSN_CODE: Joi.number().required(),
//     GST: Joi.number().required()
// })

module.exports = { 
    authSchema
}