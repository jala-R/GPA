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
        required:true
    }
})


ClientSchema.pre("save",function(next){
    console.log(this);
    this.generatePrivateKey();
})

const Client=mongoose.model("client",ClientSchema);

Client.prototype.generatePrivateKey=function(){
    console.log("createing and saveing new private key")
}

module.exports=Client;