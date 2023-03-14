const express=require('express');
const router=express.Router();
const {signup, signin, verifyToken, getuser, refreshToken, logout}=require('../controllers/user-controller');
router.get('/', (req, res)=>{
    res.send('Hello from the home');
});
router.post('/signup', signup);
router.post('/signin', signin);
router.get('/user', verifyToken, getuser);
router.get('/refresh', refreshToken, verifyToken, getuser);
router.post('/logout',verifyToken, logout);

module.exports=router;