const JWT = require('jsonwebtoken')
const createError = require('http-errors')

module.exports = {
    signAccessToken: (userId) => {
        return new Promise((resolve, reject)=>{
            const payload = {}
            const secret = process.env.ACCESS_TOKEN_SECRET
            const options = {
                expiresIn: '10d',
                audience: userId,
            }

            JWT.sign(payload, secret, options, (err, token)=>{
                if(err) return reject(createError.InternalServerError())
                resolve(token)
            })
        })
    }, 
    verifyAccessToken: (req, res, next) => {
        if(!req.headers['authorization'])return next(createError.Unauthorized())
        const token = req.headers['authorization'].split(' ')[1]

        JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload)=>{
            if(err){
                const message = err.message === 'JsonWebTokenerror' ? 'Unauthorized' : err.message
                next(createError.Unauthorized(message))
            }

            req.payload = payload
            next()
        })
    }
}