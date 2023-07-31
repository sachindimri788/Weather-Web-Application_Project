require('dotenv').config(); //not working
const express = require('express');
const app=express();
const port= process.env.PORT || 4500;
const path=require('path');
const bcrypt=require("bcrypt");
const jwt=require('jsonwebtoken');
const auth=require("./middleware/auth");
const cookieParser=require('cookie-parser');
//use cookieParser as a middleware


app.use(cookieParser());


// console.log(process.env.SEC); not working

//ejs view
app.set('view engine','ejs');

//public static path for css and js 
const static_path=path.join(__dirname,"./views/template");
app.use(express.static(static_path));


//to read the json (html form entries)
app.use(express.json());
app.use(express.urlencoded({extended:false}));


//conn page to connect with database
require("./db/conn");


//importing the schema for database
const Register=require("./models/formmodel")


//main
app.get("/index", auth , (req,res)=>{
   // console.log(req.cookies.jwt+"hello");
   console.log(req.user.firstname); // I M P O R T A N T     IMPORTANT we can access req.user 
    res.render("index",{namm:req.user.firstname});
})

app.get("/about",auth,(req,res)=>{
    res.render("about",{namm:req.user.firstname});
})

app.get("/weather",auth,(req,res)=>{
    res.render("weather",{namm:req.user.firstname});
})




app.get('/',(req,res)=>{
    res.render("login")
})


//login check
app.post('/',async (req,res)=>{
    try {
        const email1=req.body.email;
        const pass=req.body.password;
        
        const useremail = await Register.findOne({email:email1}); //or object structuring says if two same name then you can use one  ({email}) simple
        
        const isMatch= await bcrypt.compare(pass, useremail.password)
       
        const token=await useremail.generateAuthToken(); //generate token at the time of login
       
        res.cookie("jwt",token); //res.cookie("jwt",token, { expirres:new Date(date.now()+30000),httpOnly:true,secure:true}); after 3 sec cookies expiry http:true means client unable to delete cookie.. secure:true it means it will run only https servers      
       
       
        if(isMatch){
                                                      // const nam=useremail.firstname;   //fetching first name
            res.status(201).render("index",{namm:useremail.firstname});                               //,{namm:nam}     // <%=namm%> where we want to get 
        }else{
            res.send("WRONG PASSWORD")
        }

    } catch (error) {
        res.status(400).send("invalid")
    }

})


app.get('/register',(req,res)=>
{
    res.render("register");
})

//after registering
app.post('/register',async (req,res)=>
{
    try {
        const password =req.body.password;
        const cpassword =req.body.confirmpassword;

        if(password===cpassword){
              const registerEmployee = new Register({
                 firstname:req.body.firstname,
                 lastname:req.body.lastname,
                 email:req.body.email,
                 gender:req.body.gender,
                 phone:req.body.phone,
                 age:req.body.age,
                 password:req.body.password
              })
              const token= await registerEmployee.generateAuthToken(); //call a fucnction to generate a token;
              
              // the res.cookie() function is used to set the cookie name to value.
              // the value parameter may be a string or object converted to JSON.

              res.cookie("jwt",token);
              //res.cookie("jwt",token, { expirres:new Date(date.now()+30000),httpOnly:true}); after 3 sec cookies expiry http:true means client unable to delete cookie
              const registered = await registerEmployee.save();

              res.status(201).render("index",{namm:req.body.firstname});
        }
        else{
            res.send("password are not matching")
        }
    } catch (error) {
        res.status(400).send(error);
    }
    
})

//if wrong url
app.get("*",(req,res)=>{
    res.render("404");
})


app.listen(port, ()=>{
    console.log(`listening to the port at ${port}`) //BACK TICK BELOW TAB DOUBLEQUATES" " ARE USED IN V5 BUT WE USE BACK TICK IN V6 BECAUSE IN BACKTICK WE DON'T WANT ANY CONCATINATION SIGN LIKE +
})

