const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcyrpt = require('bcrypt')

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
});

UserSchema.pre('save', async function(next){
  try {
    const hashedPassword = await bcyrpt.hash(this.password, 10)
    this.password = hashedPassword
    next()
  }
  catch (error) {
    next(error)
  }
})

UserSchema.methods.isValidPassword = async function(password){
  try {
    return await bcyrpt.compare(password, this.password)
  }
  catch (error) {
    throw error  
  }
}

const User = new mongoose.model("User", UserSchema);
module.exports =  User;
