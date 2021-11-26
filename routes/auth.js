const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

//REGISTER
router.post("/register", async (req, res) => {
  try {
    //generate new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //create new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    //save user and respond
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err)
  }
});
const u ={
  email:"deepshah1309@gmail.com",
  password:"1234"
}
//LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    !user && res.status(404).json("user not found");

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    //const validPassword = req.body.password ===u.password;
    !validPassword && res.status(400).json("wrong password")
    //JWT signature
    console.log(req.body);

    res.status(200).json(user)
    // const token = jwt.sign(
    //   { email: u.email },
    //   'deepshah',
    //   { expiresIn: '24h' });
     
      
    //  res.setHeader('Authorization', token);
    //  res.status(200).json(u)
  } catch (err) {
    console.log(err);
    res.status(500).json(err)
  }
});

module.exports = router;
