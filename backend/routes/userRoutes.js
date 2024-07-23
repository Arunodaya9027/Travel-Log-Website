const express = require('express')
const router = express.Router();
const User = require('../model/userModel');
const Session = require('../model/sessionModel');
const bcrypt = require('bcrypt');
const cors = require('cors');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken');
dotenv.config();


// router.get('/login', (req, res)=>{
//     res.render('auth/login')
// })

// router.get('/signup', (req, res)=>{
//     res.render('auth/signup')
// })


// router.post('/register', async(req, res)=>{
//     const {username, email, password} = req.body;

//     const user = new User({username, email});
//     // await User.create({username, email, password});

//     await User.register(user, password);

//     res.redirect('/login');
// })

// router.post('/register', passport.authenticate('local-register', {
//     successRedirect: '/login',
//     failureRedirect: '/register',
//     failureFlash: true
// }));

// router.post('/login', passport.authenticate(
//     'local', 
//     { failureRedirect: '/login' }), (req, res) => {
//         res.redirect('/product');
// });


// router.post('/subscribe',async(req,res)=>{
//     console.log(req.body);
//     console.log(res)
//     const transporter = nodemailer.createTransport({
//       // service: "Gmail",
//       host: "smtp.gmail.com",
//       port: 465,
//       secure: true,
//       auth: {
//         user: "master8525aps@gmail.com",
//         pass: "qimgcalnkeolxuob",
//       },
//     });

//     console.log("transporter", transporter);

//     const mailOptions = {
//       from: process.env.EMAIL_USER, // sender
//       to: req.body.email, //reciever
//       subject: "Registration",
//       text: "Thank you",
//       html: "<h1>Thank you for Registering🎉🎉</h1>",
//     };

//     console.log("mail optn$$$$$$$", mailOptions);

//     try {
//       const info = await transporter.sendMail(mailOptions);
//       console.log("Email sent:", info.response);
//     } catch (error) {
//       console.log("Email Unsent:", error);
//     }
// })


// register
router.post('/auth/register', async (req, res) => {
  console.log(req.body);
  try {
    // hashing the password
    const otp = Math.floor(100001 + Math.random() * 899999);
    console.log("otp___",otp)
    console.log("pass1");
    const salt = await bcrypt.genSalt(10);  
    const hashPass = await bcrypt.hash(req.body.password, salt);
    console.log("pass2");
    const newUser = new User({
        firstName: "",
        lastName: "",
        username: req.body.userName,
        dob:"",
        gender:"Not Prefer To Say",
        pincode:"",
        phone:"",
        email: req.body.email,
        password: hashPass,
        cfp: req.body.cfp,
        cards: 3,
        subscription: "Classic",
        isEnd: "Never",
        profilePic: "https://res.cloudinary.com/dfd6fmijq/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1715039682/profile/default-profile-pic_cwtbgb.jpg",
        bio: "",
        address: "",
        confirmRegistration: false,
        wishList: []
    });
    console.log(newUser);
    // adding the schemas of the user and cases
    // .populate;
    const user = await newUser.save();

    console.log("pass3");
    // console.log(process.env.SMTP_HOST);
    // console.log(process.env.SMTP_MAIL);
    // console.log(process.env.SMTP_PASS);
    // console.log(process.env.SMTP_PORT);
    // -----------------------------------------------------------------
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      // host: "smtp.gmail.com",
      port: process.env.SMTP_PORT,
      // port: 587,
      secure: false, // Use `true` for port 465, `false` for all other ports
      auth: {
        user: process.env.SMTP_MAIL,
        // user: "master8525aps@gmail.com",
        pass: process.env.SMTP_PASS,
        // pass: "qimgcalnkeolxuob",
      },
    });
    console.log("pass3.1");

    console.log("transporter", transporter);
     const mailOptions = {
       //  from: process.env.SMTP_MAIL,
       from: "master8525aps@gmail.com",
       to: req.body.email,
       subject: "Travel Log Account Verification",
       html: `<h1>HELLO ${req.body.userName}, Below is the verification code for you</h1><p>Dont share it with anyone</p><b>${otp}</b>`,
     };
     console.log("pass3.5");
    console.log("mail optn$$$$$$$", mailOptions);
    const mailStatus = null;
    var flag = true;
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent:", info.response);
    } catch (error) {
      flag = false;
      console.log("Email Unsent:", error);
    }
    // ---------------------------------------------------------------------------

    console.log(user);

    const editUser = await User.find({ username: req.body.userName });
    console.log("pass2");
    const update = {
      $set: {
        secretKey: otp,
        mailStatus: flag
    }};
    console.log("update");
    const updatedUser = await User.updateOne({ username: req.body.userName }, update);
    console.log(updatedUser);
    console.log("pass5");
    res.status(200).json(user, otp, mailStatus);
  } catch (err) {
    res.status(500).json(err);
  }
});

async function isValidOtp(userId, otp) {
  const user = await User.find({_id: userId}); // Fetch user data
  if (!user || !user[0].secretKey) {
    return false;
  }

  // const decoded = jwt.verify(otp, user[0].secretKey); // Verify the TOTP using the secret key
  // console.log(decoded);
  // const currentTime = Math.floor(Date.now() / 1000); // Current Unix timestamp

  // // Check if the decoded OTP is within a valid time window (adjust window as needed)
  // return decoded.iat >= currentTime - 900 && decoded.iat <= currentTime + 900;
  const decoded = otp === user[0].secretKey;
  return decoded;
}

router.post('/validate-otp/:id', async (req, res) => {
  console.log(req.body); // Log for debugging purposes

  try {
    const id = req.params.id;
    console.log(id);
    const { otp, email } = req.body; // Destructure id and otp from request body
    console.log("1");

    // Validate OTP (replace this with your actual OTP validation logic)
    const u = await User.find({_id: id});
    console.log(u);
    if(!(u[0].mailStatus)) {
      console.log("2");
      return res.status(401).json({ message: 'Mail not send' });
    }
    else if (await isValidOtp(id, otp)) {
      console.log("3");
      return res.status(401).json({ message: 'Invalid OTP' });
    }

    const user = await User.find({ _id: id });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const update = {
      $set: {
        confirmRegistration: true,
        secretKey: null,
        mailStatus: null
      }
    };

    const updatedUser = await User.updateOne({ _id: id }, update);
    console.log(updatedUser);
    res.status(200).json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error(err); // Log the actual error for debugging
    res.status(500).json({ message: 'An error occurred during update' }); // Generic error message for the user
  }
});

router.get('/email/:id', async(req, res) => {
  const id = req.params.id;
  console.log(id);
  const user = await User.find({ _id: id })
    .then((user) => {
      console.log(user);
      res.json(user[0].email);
    })
    .catch((err) => {
      res.json(err);
    });
})

router.post('/setup-profile/:id', async (req, res) => {
  console.log(req.body);
  try {
    console.log("pass1");
    const id = req.params.id;
    console.log(id);
    const user = await User.find({ _id: id });
    const {firstName, lastName, dob, gender, phone, pincode, profilePic, bio} = req.body;
    console.log("pass2");
    const update = {
      $set: {
        firstName: firstName,
        lastName: lastName,
        dob:dob,
        gender:gender,
        pincode: pincode,
        phone:phone,
        profilePic: profilePic,
        bio: bio
    }};
    console.log("update");
    const updatedUser = await User.updateOne({ _id: id }, update);
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/setup-profile/:id', async(req, res) => {
  const id = req.params.id;
  console.log(id);
  const user = await User.find({ _id: id })
    .then((user) => {
      console.log(user);
      res.json(user);
    })
    .catch((err) => {
      res.json(err);
    });
});


  
// login
router.post('/auth/login', async (req, res) => {
  try {
    const filter = {
      $or: [
        { username: req.body.name },
        { email: req.body.name } // Assuming 'name' is intended for login here
      ],
    };
    const user = await User.findOne(filter);

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }
    console.log(user);
    console.log(req.body.password);

    
    const isPasswordValid = (req.body.password == user.cfp);

    if (!isPasswordValid) {
      return res.status(400).json({ error: "Wrong password" });
    }
    console.log("pass1");
    // Include additional fields (ContractAdd, Walletadd, Phone) in the response
    
    // const { ContractAdd, Walletadd, Phone } = userData;

    res.status(200).json({ user});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// router.get('/getlogin',async(req,res)=>{
//   const data = await User.findOne()
//   res.status(200).json(data);
// })

router.post('/auth/create-session', async (req, res) => {
  try {
    
    const {id, startTime} = req.body;
    const newSession = new Session({
      userId: id,
      startTime: startTime,
      endTime: null,
      status: true
  });
    // console.log("open");
    console.log(newSession);
    // adding the schemas of the user and cases
    // .populate;
    const session = await newSession.save();
    console.log(session);
    res.status(200).json(session);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/session/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findOne({_id: id});
    // console.log("open");
    if(!user) {
      return res.status(400).json({ error: "User not found" });
    }
    console.log(user);
    // adding the schemas of the user and cases
    // .populate;
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

// logout
router.post('/logout/:id', async(req, res) => {
  // Destroy the session to log the user out
  try {
    const id = req.params.id;
    const { endTime} = req.body;
    const filter = {
      $and: [
        { userId: req.body.id }, // Assuming 'id' is the unique identifier for the user
        { status: true } // Filter for active users (assuming 'status' indicates active/inactive state)
      ]
    };
    const session = await Session.findOne(filter);
    if (!session) {
      return res.status(400).json({ error: "User not found" });
    }
    console.log(session);
    // adding the schemas of the user and cases
    // .populate;
    const update = {
      $set: {
        endTime: endTime
    }};
    console.log("update");
    const updatedUser = await User.updateOne({ userId: id }, update);
    res.status(200).json({ message: "Profile updated successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
}); 

// app.get('/', (req, res) => {
//   const isLoggedIn = req.session.user ? true : false;
//   res.render('home', { isLoggedIn });
// });


module.exports = router;