const mongoose=require('mongoose');
require('dotenv').config();


mongoose.connect(process.env.db_url).then(()=> {
    console.log(`connect`);
}).catch((err)=>console.log(err));
