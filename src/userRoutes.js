const app=require("express").Router(),
    jwt=require("jsonwebtoken"),
    sendEmail=require("../helper/sendEmail"),
    isEmailVerified=require("../helper/isEmailVerified"),
    multer=require("multer"),
    User=require("../db/model/user"),
    bcrypt=require("bcryptjs");



//TODO
//get email -> send token to the email->return 200
//done          done                        done
app.post("/email-verification",async (req,res)=>{
    try{
        let email=req.body.email;
        let user=await User.findOne({username:email});
        if(!user)throw new Error("user already exist");
        let token=jwt.sign({email},process.env.JWTSECRET,{
            expiresIn:600
        })
        // console.log(token);
        let url=`${req.protocol}://${req.headers.host}/email-verification/${encodeURI(token)}`;
        await sendEmail(email,"email verification",url);
        res.send();
    }catch(err){
        res.status(404).send(err.message);
    }
})


//TODO
//get token -> decode -> verify token  -> set cookie(nid) -> 200
//done          done        done            done             done
app.get("/email-verification/:token",(req,res)=>{
    try{
        let {token}=req.params;
        // console.log(token)
        token=decodeURI(token)
        let payload=jwt.verify(token,process.env.JWTSECRET);
        
        res.cookie("nid",payload.email,{
            maxAge:1000*60*10,
            httpOnly:true,
            path:"/set-password",
            signed:true,
            secure:true,
            sameSite:"none"
        })
        res.redirect(process.env.FRONTURI+"/signup/gpa2")
    }catch(err){
        res.status(404).send(err.message);
    }
})


//TODO
//getsignedcookie -> get email -> store image in DB -> create a new user -> store images accuracy -> store coordinater in hash -> set login cookie -> 200
//  done                done        
app.post("/set-password",multer().single("img"),async (req,res)=>{
    try{
        console.log(req.body);
        console.log(req.file);
        console.log(req.signedCookies)
        const accuracy=Number(req.body.accuracy);
        const points=JSON.parse(req.body.points);
        let boxCnt=400/accuracy;
        let textPassword="";
        for(let i in points){
            let num=Number(points[i])-1;
            let x=Math.floor(num/boxCnt);
            let y=Math.floor(num%boxCnt);
            textPassword+=String(i)+" "+String(x)+" "+String(y);
        }
        let newUser=new User({
            username:req.signedCookies.nid,
            password:await bcrypt.hash(textPassword,8),
            accuracy,
            image:{data:req.file.buffer,mimetype:req.file.mimetype}
        })
        await newUser.save();
        res.send(newUser);
    }catch(err){
        res.status(404).send(err.message);
    }
})


module.exports=app;