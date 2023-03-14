const express=require('express');
const mongoose=require('mongoose');
const cors=require('cors');
require('dotenv').config();
const router=require('./routes/user-routes.js');
const app=express();
app.use(cors({
    credentials: true,
    origin: "http://localhost:3000"
}));
const cookieParser=require('cookie-parser');
app.use(express.json());
app.use(cookieParser());
app.listen(4000);
require('./database/dbconnect.js');
app.use('/', router);