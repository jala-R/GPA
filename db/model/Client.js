const bcrypt = require("bcryptjs/dist/bcrypt");
const mongoose=require("mongoose");


const ClientSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    callbackUrl:[{
        type:String,
        required:true
    }],
    domain:{
        type:String,
        required:true
    },
    privateKey:{
        type:String,
    },
    accesToken:[new mongoose.Schema({
        data:{
            id:{
                type:String,
                required:true
            },
            username:{
                type:String,
                required:true
            }
        }
    })]
})


ClientSchema.pre("save",async function(next){
    if(!this.privateKey)await this.generatePrivateKey();
    next();
})

const Client=mongoose.model("client",ClientSchema);


Client.prototype.keyCnt=0;


Client.prototype.generatePrivateKey=async function(){
    this.keyCnt++;
    let toHash=this.id+"--"+this.keyCnt;
    let key=await bcrypt.hash(toHash,8);
    this.privateKey=key;
}

Client.prototype.validateClient=function(key){
    return this.privateKey===key;
}

Client.prototype.checkCallback=function(givenUrl){
    for(let callback in this.callbackUrl){
        if(this.callbackUrl[callback]===givenUrl)return true;
    
    }

    return false;
}

Client.prototype.generateAccesToken=function(user){
    this.accesToken.push({
        data:{
            id:user._id,
            username:user.username
        }
    })
}


module.exports=Client;