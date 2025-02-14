const joi = require('joi');

exports.registerSchema = joi.object({
    rollNo : joi.number().required(),
    password : joi.string().required(),
    email : joi.string().email({
        tlds: { allow: ['com', 'net'] }

    }).required(),
    roles : joi.string().valid('student','staff' ,'hod').required(),
});

exports.loginSchema = joi.object({
    rollNo : joi.number().required(),
    password : joi.string().required(),
    email : joi.string().email({
        tlds: { allow: ['com', 'net'] }

    }),
    roles : joi.string().valid('student','staff' ,'hod').required(),
         
});