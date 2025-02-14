const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    rollNo : {
        type: Number,
        required: [true,"RollNo is required"],
        unique : true,
       
    },

    password: {
        type : String,
        required : [true,"Password is required"],
        trim : true,
        select : false,
    },

     email : {
        type : String,
        required : [true,"Email is required"],
        unique : true,
        trim : true,
    },
    
    roles : {
        type : String,
        enum :['student','staff' ,'hod'],
        default: 'student',
    },

    department : {
        type : String
    },

    className : {
        type : String,
        trim : true
    },
    timetable : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'TimetableModel'
        }
    ] 
    




},{
    timestamps : true,
})

module.exports = mongoose.model('UserModel',userSchema);