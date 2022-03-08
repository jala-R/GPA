const mongoose=require("mongoose");


const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    accuracy:{
        type:Number,
        required:true,
        min:8,
        max:100
    },
    image:{
        type:new mongoose.Schema({
            data:{
                type:Buffer,
                required:true
            },
            mimetype:{
                type:String,
                required:true
            }
        }),
        required:true
    }
})


const User=mongoose.model("User",userSchema);

module.exports=User;