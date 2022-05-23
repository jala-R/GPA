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
    }
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


module.exports=Client;