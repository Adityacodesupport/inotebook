const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "aditya@#12121";

// Route /api/auth/createuser for user authentication..
router.post(
  "/createuser",
  [
    body("name").isLength({ min: 3 }),
    body("email").isEmail(),
    body("password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    // if there are errors, then return Bad request and errors with them.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //check whether the user has same email and password already exists or not..
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ errors: "The user with this credentials is already exist" });
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

      res.json({ authtoken });
    } catch (error) {
      res.status(500).send("Some error occured");
    }
  }
);
router.post(
  "/login",
  [
    body("email","Enter a valid email").isEmail(),
    body("password","Password cannot be blank").exists(),
  ],
  async (req, res) => {
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
        return res.status(400).json({errors:"Please enter valid credentials"});
      }
      const passwordCompare=await bcrypt.compare(password,user.password);
      if(!passwordCompare)
      {
        return res.status(400).json({errors:"Please enter valid credentials"});
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      // Here jwt.sign() method is sync ,so we don't need to use await here....
      const authtoken = jwt.sign(data, JWT_SECRET);
      res.json({authtoken});

    }catch(error){
      console.error(error.message);
      return res.status(500).json({errors:"Internal Server Error"});
    }
    
    
  }
);
module.exports = router;
