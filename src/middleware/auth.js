const jwt=require("jsonwebtoken");
const Register=require("../models/formmodel");


const auth= async (req,res,next)=>{
    try {
        const token=req.cookies.jwt;
        const verifyUser=jwt.verify(token,"mynameissachindimriyessachindimri");
        console.log(verifyUser);

        const user= await Register.findOne({_id:verifyUser._id});
        console.log(user.age);

        req.token=token; //we can use this in function
        req.user=user;
        next();

    } catch (error) {
        res.status(401).send("auth error"+error);
    }
}

module.exports=auth;