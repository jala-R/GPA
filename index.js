const express=require("express"),
    app=express(),
    userRoutes=require("./src/userRoutes"),
    cookieParser=require("cookie-parser");
require("./db/connect");



//configs
app.use(express.json());
app.use(cookieParser(process.env.COOKIESECRET));
app.enable('trust proxy')
app.use((req,res,next)=>{
    res.set("Access-Control-Allow-Origin",process.env.FRONTURI)
    res.set("Access-Control-Allow-Headers","Content-type")
    console.log(res.getHeader("Access-Control-Allow-Origin"))
    next()
})


//routes merge point
app.use(userRoutes)

app.options("/*",(req,res)=>{
    res.send();
})

app.listen(process.env.PORT,()=>{
    console.log(`server running on ${process.env.PORT}`)
})