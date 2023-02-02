const express = require('express')
const router = express.Router()
const createError = require('http-errors')
const User = require('../models/User.model')
const { authSchema } = require('../helpers/validation_schema')
const { signAccessToken } = require('../helpers/jwt_helper')

router.post('/register', async (req,res,next)=>{
    try{
        const result = await authSchema.validateAsync(req.body)
        const { email, password } = result

        const doesExist = await User.findOne({email})
        if(doesExist) throw createError.Conflict(`${email} is already been registered`)

        const user = new User({email, password})
        const savedUser = await user.save()

        const accessToken = await signAccessToken(savedUser.id)
        res.send({accessToken})
    }
    catch (error) {
        if(error.isJoi) return next(createError.BadRequest('Invalid Username/Password'))
        next(error)
    }
})

router.post('/login', async (req,res,next)=>{
    try {
        const result = await authSchema.validateAsync(req.body)
        const user = await User.findOne({email: result.email})
        if(!user) throw createError.NotFound('User not registered')

        const isMatch = await user.isValidPassword(result.password)
        if(!isMatch) throw createError.Unauthorized('Username/Password not valid')

        const accessToken = await signAccessToken(user.id)
        res.send({accessToken})
    }
    catch (error) {
        if(error.isJoi) return next(createError.BadRequest('Invalid Username/Passowrd'))
        next(error) 
    }
})

module.exports = router