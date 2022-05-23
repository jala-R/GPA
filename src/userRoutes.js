const app=require("express").Router(),
    jwt=require("jsonwebtoken"),
    sendEmail=require("../helper/sendEmail"),
    isEmailVerified=require("../helper/isEmailVerified"),
    multer=require("multer"),
    User=require("../db/model/user"),
    bcrypt=require("bcryptjs"),
    Client=require("../db/model/Client");



//TODO
//get email -> send token to the email->return 200
//done          done                        done
app.post("/email-verification",async (req,res)=>{
    try{
        let email=req.body.email;
        let user=await User.findOne({username:email});
        if(user)throw new Error("user already exist");
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
        console.log(textPassword);
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


//TODO
//get username -> send img link;
app.post("/getImageLink",async (req,res)=>{
    try{
        let user=await User.findOne({username:req.body.email});
        if(!user)throw new Error("invalid user");
        res.send(user._id);
    }catch(err){
        res.status(404).send(err.message);
    }
})

app.get("/image/:id",async (req,res)=>{
    try{
        let user=await User.findById(req.params.id);
        if(!user)throw new Error("invaild user");
        res.set("Content-Type",user.image.mimetype);
        res.set("Content-Length",Buffer.byteLength(user.image.data));
        res.send(user.image.data);
    }catch(err){
        res.status(404).send(err.message);
    }
})

app.post("/login",async (req,res)=>{
    try{
        let {id,points}=req.body;
        console.log(typeof(id));
        console.log(typeof(points));
        let user=await User.findById(id);
        if(!user)throw new Error("invalid login");
        let textPassword="";
        let accuracy=user.accuracy;
        for(let i=0;i<3;i++){
            // console.log(typeof(points[i][0]),typeof(points[i][0]))
            let y=Math.floor(points[i][0]/accuracy);
            let x=Math.floor(points[i][1]/accuracy);
            textPassword+=String(i)+" "+String(x)+" "+String(y);
        }
        console.log(textPassword);
        let result=await bcrypt.compare(textPassword,user.password);
        if(result)return res.send({username:user.username,id:user._id});
        throw new Error("invalid login");
    }catch(err){
        res.status(404).send(err.message);
    }
})
///signup and login over



//generate confidential client
app.get("/test",async (req,res)=>{
    try{
        let temp=new Client({
            name:"sldnckjsd",
            callbackUrl:["sdsdvsvdsv"],
            domain:"sddscsvsdv"
        })
        await temp.save();
        res.send(temp)
    }catch(err){
        res.send(err.message);
    }
})

app.get("/validate/:id/",async (req,res)=>{
    try{
        let client=await Client.findById(req.params.id);
        res.send(await client.validateClient(req.query.key))
    }catch(err){
        res.status(404).send(err.message)
    }
})

module.exports=app;