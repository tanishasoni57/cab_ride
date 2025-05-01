const express = require('express');
const app=express();
const cookieParser = require('cookie-parser');
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
app.use(express.urlencoded({extended:true}));
app.use(cookieParser()); // Moved to the correct position!
app.use('/users',userRoutes);
module.exports = app;