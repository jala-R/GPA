const mongoose=require("mongoose");

mongoose.connect('mongodb://localhost:27017/test')
.then(()=>{
    console.log("db Connected..!");
})
.catch((err)=>{
    console.log(err.message);
})