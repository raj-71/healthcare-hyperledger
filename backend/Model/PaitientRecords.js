const mongoose = require('mongoose');

const RecordSchema = new mongoose.Schema({
    
    doctorId:{
     type:Number,
     required: [true, "Please Enter Doctor Id"],


    },
    patientId:{
        type:Number,
        required: [true, "Please Enter Patient Id"],
   
   
       },

       RecordId:{
        type:Number,
        required: [true, "Please Enter Record Id"],
   
   
       },
       

    createdAt: {
        type: Date,
        default: Date.now,
    },
   
});

module.exports = mongoose.model('Record', RecordSchema);