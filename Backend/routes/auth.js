const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "aditya@#12121";
const fetchuser = require("../middleware/fetchuser");

// Route 1: /api/auth/createuser for user authentication..(No login is Required)
router.post(
  "/createuser",
  [
    body("name").isLength({ min: 3 }),
    body("email").isEmail(),
    body("password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    let success=false;
    // if there are errors, then return Bad request and errors with them.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success, errors: errors.array() });
    }

    //check whether the user has same email and password already exists or not..
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({success, errors: "The user with this credentials is already exist" });
      }

      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      // Here jwt.sign() method is sync ,so we don't need to use await here....
      const authtoken = jwt.sign(data, JWT_SECRET);
      // console.log(authtoken);
      // .then(user => res.json(user))
      // .catch(err=>{console.log(err)
      // res.json({error:"Please enter a unique value for email"})})
      
      success=true;
      res.json({success, authtoken });
    } catch (error) {
      res.status(500).send("Some error occured");
    }
  }
);

// Route 2:  /api/auth/login for user login (No login is Required).
router.post(
  "/login",
  [
    body("email","Enter a valid email").isEmail(),
    body("password","Password cannot be blank").exists(),
  ],
  async (req, res) => {
    let success=false;
    // if there are errors, then return Bad request and errors with them.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const{email,password}=req.body;
    try{
      const user=await User.findOne({email});
      if(!user)
      {
        success=false;
        return res.status(400).json({errors:"Please enter valid credentials"});
      }
      const passwordCompare=await bcrypt.compare(password,user.password);
      if(!passwordCompare)
      {
        success=false;
        return res.status(400).json(success,{errors:"Please enter valid credentials"});
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      // Here jwt.sign() method is sync ,so we don't need to use await here....
      const authtoken = jwt.sign(data, JWT_SECRET);
      success=true;
      res.json({success,authtoken});

    }catch(error){
      console.error(error.message);
      return res.status(500).json({errors:"Internal Server Error"});
    }
  }
);

// Route 3:  Get login user details  POST "/api/auth/getuser" for getuser (login is Required).
router.post("/getuser",fetchuser,async (req,res)=>{
    try{
      userID=req.user.id;
      const user=await User.findById(userID).select("-password");
      res.send(user);
    }catch(error){
      console.error(error.message);
      return res.status(500).json({errors:"Internal Server Error"});
    }
  })
module.exports = router;
