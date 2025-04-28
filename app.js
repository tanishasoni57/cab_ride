const express = require('express');
const app=express();
const dotenv = require('dotenv');
const userRoutes = require('./routes/user.routes');
dotenv.config();
const cors =require('cors');
app.use(cors());
const connectToDb = require('./db/db');
connectToDb();
app.get('/',(req,res) =>{
    res.send('hello world');
});
app.use(express.json());
app.use('/users',userRoutes);
app.use(express.urlencoded({extended:true}));
module.exports = app;