const jwt = require('jsonwebtoken');
const { doHash , doHashValidation} = require("../utils/hasing")
const {registerSchema , loginSchema } = require("../Midddleware/ValidatorsAuth")
const userModel = require('../Models/UserModel');



exports.register =  async(req, res) =>{
    const {rollNo , password , email, roles} = req.body;

    try {

        const {error} = registerSchema.validate({
            rollNo , password , email, roles
        });
        if(error){
            return res.status(400).json({
                success : false,
                message : error.details[0].message
            })
        }

        const existingUser = await userModel.findOne({rollNo});

        if(existingUser){
            return res.status(400).json({
                success : false,
                message : "User already exists"
            })
        }

        const hashedPassword = await doHash(password, 12 );
          
         const newUser =  new userModel({
            rollNo ,

            password : hashedPassword,
            email,
            roles
         });

         const savedUser = await newUser.save();
         const userWithoutPassword = savedUser.toObject();
         delete userWithoutPassword.password;

         res.status(201).json({
            success : true,
            message : "User saved successfully",
            user : userWithoutPassword
         })
    } catch (error) {
         console.log(error);
         res.status(500).json({
            success : false,
            message : "Internal Server Error"
            })
    }
};

exports.login = async(req,res) =>{
    const { rollNo , password , roles } = req.body;
    try {
        const {error} = loginSchema.validate({
            rollNo ,
            password ,
            roles
        });

        if(error) {
            return res.status(400).json({
                success : false,
                message : error.details[0].message
            })

        }

        const existingUser = await userModel.findOne({rollNo, roles}).select("+password");

        if(!existingUser){
            return res.status(404).json({
                success : false,
                message : "User not found"
            })
        }
        const isPasswordValid = await doHashValidation(password , existingUser.password);

        if(!isPasswordValid){
            return res.status(401).json({
                success : false,
                message : "Invalid password",
            })
        }

        const token = jwt.sign({
            userId : existingUser._id,
            rollNo : existingUser.rollNo,
            roles : existingUser.roles

        }, process.env.SECRET_KEY,{expiresIn : "1h"});
         
     
        res.cookie(
            'Authorization',`Bearer ${token}`,{
                httpOnly : true,
                expires : new Date(Date.now() + 3600000),
                secure : process.env.NODE_ENV === "production",
            }

        )

        return res.status(200).json({
            success: true,
            message: "User logged in successfully",
            token : token,
             // optionally return token to client if needed
          });
        
        
    } catch (error) {
            console.log(error);
            return res.status(500).json({
                success : false,
                message : "Internal server error"
                })
    }
}


exports.signOut = async(req , res) =>{
    res.clearCookie('Authorization');
    res.status(200).json({
        success : true,
        message : "User signed out successfully"
    })
}