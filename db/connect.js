const mongoose=require("mongoose");

mongoose.connect(process.env.DBURL)
.then(()=>{
    console.log("db Connected..!");
})
.catch((err)=>{
    console.log(err.message);
})