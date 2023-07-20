const userModel = require('../DataBase/Models/userModel')
const tokenModel = require('../DataBase/Models/tokenModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const axios = require('axios')

// cgenerate otp
exports.generateOtpController = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // validation
    if (!username || !email || !password) {
      return res.status(400).send({
        message: "please fill all fields",
        success: false,
      });
    }

    // existing user
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(401).send({
        message: "user already exists",
        success: false,
      });
    }

    const {data} = await axios.post('http://localhost:9090/generateOtp',{email:email})
    if(data?.success){
      return res.status(200).send({
        message: "otp generated successfully",
        success: true,
        otp:data.otp
      });
    }
    // if error in generating otp
    return res.status(400).send({
      message: {...data},
      success: false,
    });


  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Error in generateOTP callback",
      successs: false,
      error
    });
  }
};


// create user register
exports.registerController = async (req, res) => {
  try { 
    const { username, email, password,otp } = req.body;
    console.log('in register controller')
    const {data} = await axios.post('http://localhost:9090/validateOtp',{email:email,otp:otp})
    console.log('...........................')
    console.log(data)
    if(!data?.success){
      console.log('dta not success')
      return res.status(400).send({
        message:data.message,
        success:false
      });
    }
    const hashedPassword = await bcrypt.hash(password,10)

    const newUser = new userModel({ username, email, password:hashedPassword });
    await newUser.save();
    return res.status(200).send({
      message: "New user created",
      success: true,
      newUser
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Error in Register callback",
      successs: false,
      error
    });
  }
};



// get all users
exports.getAllUsers = async (req, res) => {
    try{
        const users = await userModel.find({})
        res.status(200).send({
            userCount:users.length,
            message:'all users data',
            success:true,
            users
        })

    }catch(error){
        console.log(error);
        return res.status(500).send({
        message: "Error in fetching users callback",
        successs: false,
        error
    });
    }
};

//login
exports.loginController = async (req,res) => {
    try {
        const {email, password } = req.body;
    
        // validation
        if (!email || !password) {
          return res.status(400).send({
            message: "please provide email and password",
            success: false,
          });
        }
    
        const user = await userModel.findOne({email})
        if(!user){
            return res.status(401).send({
                message:'email is not registered',
                success:false
            })
        }
        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(401).send({
                message:'Invalid username or password',
                success:false
            })
        }
        // generating tokens
        console.log(user._id)

        const accessToken = jwt.sign({userId:user._id},process.env.ACCESS_KEY,{expiresIn:'1h'})
        const refreshToken = jwt.sign({userId:user._id},process.env.REFRESH_KEY)

        const newToken = new tokenModel({token:refreshToken})
        await newToken.save()

        return res.status(200).send({
            message:'Login successfull',
            success:true,
            accessToken:accessToken,
            refreshToken:refreshToken,
            user
        })

      } catch (error) {
        console.log(error);
        return res.status(500).send({
          message: "Error in Login callback",
          successs: false,
          error
        });
      }
};
