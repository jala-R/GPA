const express=require("express"),
    app=express(),
    userRoutes=require("./src/userRoutes"),
    cookieParser=require("cookie-parser");
require("./db/connect");



//configs
app.use(express.json());
app.use(cookieParser(process.env.COOKIESECRET));
app.enable('trust proxy')


//routes merge point
app.use(userRoutes)


app.listen(process.env.PORT,()=>{
    console.log(`server running on ${process.env.PORT}`)
})