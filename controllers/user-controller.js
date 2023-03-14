const User=require('../model/user-model.js');
const bcryptjs=require('bcryptjs');
const jwt=require('jsonwebtoken');
const signup=async (req, res)=>{
    const {name, email, password}=req.body;
    const hashpassword=bcryptjs.hashSync(password,12);
    try{
        const existinguser=await User.findOne({email:email});
        if (existinguser) {
            return res.json({message: "false"});
        }
    }catch(err)
    {
        return new Error(err);
    }
    const user=new User({name,email,password:hashpassword});
    try{
        const result=await user.save();
    }catch(err)
    {
        console.log(err);
    }
    return res.status(200).json({message: `user ${name} registered succesfully`});
}
exports.signup=signup;
const signin=async (req, res)=>{
    const {email, password}=req.body;
    try{
        const existinguser=await User.findOne({email:email});
        if (!existinguser) {
            return res.json({message: "false"});
        }else{
            const ismatch=bcryptjs.compareSync(password, existinguser.password);
            if (ismatch) {
                const token=jwt.sign({id: existinguser._id}, process.env.SECRET_KEY, {
                    expiresIn: "1days"
                });
                if (req.cookies[`${existinguser._id}`]) {
                    req.cookies[`${existinguser._id}`]='';
                }
                res.cookie(String(existinguser._id), token, {
                    path: '/',
                    expires: new Date(Date.now()+24*60*60),
                    httpOnly: true,
                    sameSite: 'lax'
                })
                return res.json({message: "true"});
            }else{
                return res.json({message: "false"});
            }
        }
    }catch(err)
    {
        return new Error(err);
    }
}
exports.signin=signin;
const verifyToken=(req, res, next)=>{
    const cookies=req.headers.cookie;
    const token=cookies.split('=')[1];
    if (!token) {
        return res.json({message: "false"});
    }
    jwt.verify(String(token), process.env.SECRET_KEY, (err, user)=>{
        if(err)
        {
            console.log(err);
            console.log('token hi kharab hai saala');
            return res.json({message: "false"});
        }
        req.id=user.id;
    });
    next();
}
exports.verifyToken=verifyToken;
const getuser=async (req, res, next)=>{
    const userId=req.id;
    let user;
    try{
        user=await User.findById(userId, "-password");
    }catch(err)
    {
        return new Error(err);
    }
    return res.status(200).json(user);
}
exports.getuser=getuser;
const refreshToken=(req, res, next)=>{
    console.log('refreshToken');
    const cookies=req.headers.cookie;
    const pretoken=cookies.split("=")[1];
    if (!pretoken) {
        return res.json({message: `couldn't find token`});
    }
    jwt.verify(String(pretoken), process.env.SECRET_KEY, (err, user)=>{
        if(err)
        {
            console.log(err);
            return res.json({message: 'authentication failed'});
        }
        //clearing the cookie
        res.clearCookie(`${user.id}`);
        req.cookies[`${user.id}`]='';
        const token=jwt.sign({id: user.id}, process.env.SECRET_KEY, {
            expiresIn: '1days'
        });
        res.cookie(String(user.id), token, {
            path: '/',
            expires: new Date(Date.now()+24*60*60),
            httpOnly: true,
            sameSite: 'lax'
        });
        req.id=user.id;
    });
    next();
}
exports.refreshToken=refreshToken;
const logout=(req, res, next)=>{
    const cookies=req.headers.cookie;
    const pretoken=cookies.split("=")[1];
    if (!pretoken) {
        return res.json({message: `couldn't find token`});
    }
    jwt.verify(String(pretoken), process.env.SECRET_KEY, (err, user)=>{
        if(err)
        {
            console.log(err);
            return res.json({message: 'authentication failed'});
        }
        //clearing the cookie
        res.clearCookie(`${user.id}`);
        req.cookies[`${user.id}`]='';
        return res.json({message: 'succesfully logged out'});
    });
}
exports.logout=logout;