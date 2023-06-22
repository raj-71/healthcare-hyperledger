
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: [true, "Please Enter Your Name"],
        
    },
    orgName: {
        type: String,
        required: [true, "Please Enter Org Name"],
    },
    userId:{
     type:Number,
     required: [true, "Please Enter User Id"],


    },
    
    password: {
        type: String,
        required: [true, "Please Enter Your Password"],
        minLength: [8, "Password should have atleast 8 chars"],
        select: false,
    },
    access:[{type:Number,ref:"User"}],
   
    
    
  
  
    
    createdAt: {
        type: Date,
        default: Date.now,
    },
   
});

userSchema.pre("save", async function (next) {

    if (!this.isModified("password")) {
        next();
    }

    this.password = await bcrypt.hash(this.password, 10);
});

// userSchema.methods.getJWTToken = function () {
//     return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
//         expiresIn: process.env.JWT_EXPIRE
//     });
// }

userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}


userSchema.set('toJSON', {
    transform: function(doc, ret, opt) {
        delete ret['password']
        return ret
    }
})

module.exports = mongoose.model('User', userSchema);