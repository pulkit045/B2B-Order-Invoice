const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const createError = require('http-errors');
require('dotenv').config();
require('./helpers/init_mongodb')
const { verifyAccessToken } = require('./helpers/jwt_helper')

const AuthRoute = require('./Routes/Auth.route')

const app = express()
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

app.get("/", verifyAccessToken ,async (req,res,next) => {
  console.log(req.payload)
  res.send("Hello  from express.")
})

app.use('/api/auth', AuthRoute)

app.get(async(req, res, next)=>{
  next(createError.NotFound())
})

app.use((err,req,res,next)=>{
  res.status(err.status || 500)
  res.send({
    error: {
      status: err.status || 500,
      message: err.message
    }
  })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})