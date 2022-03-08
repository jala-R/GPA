function isEmailVerified(req,res,next){
    try{
        if(!req.signedCookies||!req.signedCookies.nid)throw new Error("email not verified");
        next()
    }catch(err){
        res.status(404).send(err.message);
    }
}

module.exports=isEmailVerified