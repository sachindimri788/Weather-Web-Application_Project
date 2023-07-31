const mongoose=require("mongoose");
const bcrypt=require("bcrypt")
const jwt=require('jsonwebtoken');

const employeeSchema = new mongoose.Schema({
    firstname:{
        type:String,
        require:true
    },
    lastname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    gender:{
        type:String,
        require:true
    },
    phone:{
        type:Number,
        required:true,
        unique:true
    },
    age:{
        type:Number,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
})

// generating tokens
employeeSchema.methods.generateAuthToken = async function(){
    try {
        const token=jwt.sign({_id:this._id.toString()}, "mynameissachindimriyessachindimri");
        this.tokens=this.tokens.concat({token:token});
        await this.save();
        return token;  //

    } catch (error) {
     res.send("error is "+error)   
    }
}

//for bcrypt hashing using    middleware
employeeSchema.pre("save",async function(next){
    
    if(this.isModified("password"))
    {   
        this.password=await bcrypt.hash(this.password,10);
    }
    next();
})

//register the schema first step
const Register =new mongoose.model("Sachinweather",employeeSchema);

module.exports=Register;