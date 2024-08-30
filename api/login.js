const express = require("express");
const userRouter = express.Router();

userRouter.get("/login", (req,res) =>{
 res.send("login");

});

