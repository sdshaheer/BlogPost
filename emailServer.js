const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const emailModel = require("./DataBase/Models/emailModel");
const connectDB = require('./DataBase/db')

dotenv.config()

connectDB()

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.post("/generateOtp", async (req, res) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: "sdshaheer5421@gmail.com",
        pass: "zfiugcqdjtimvbiv",
      },
    });

    const otp = generateOTP();

    // remove emailId if email was already present
    const userEmail =await emailModel.findOne({email:req.body.email})
    console.log(userEmail)
    if(userEmail!=null){
      await emailModel.findOneAndDelete({email:req.body.email})
    }

    console.log(req.body.email, otp);
    const newEmail = new emailModel({ email: req.body.email, otp: otp });
    await newEmail.save();
    //console.log(newEmail)

    const mailOptions = {
      from: "sdshaheer5421@gmail.com",
      to: req.body.email,
      subject: "Your OTP",
      text: `Your OTP is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);
    console.log("OTP sent successfully!");
    return res.status(200).send({
      message: "Email sent successfully otp",
      success: true,
      otp: otp,
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return res.status(500).send({
      message: "Error in generating otp",
      successs: false,
      error,
    });
  }
});

// validating the otp
app.post('/validateOtp', async (req,res)=>{
  console.log('in validate otp')
  try {
    const userEmail = await emailModel.findOne({email:req.body.email})
    //console.log(userEmail)
    // if otp entered was wrong
    console.log(userEmail.otp)
    console.log(req.body.otp)
    if(userEmail.otp!=req.body.otp){
      console.log('not equal')
      return res.status(200).send({
        message: "please enter valid OTP",
        success: false,
      });
    }
    console.log('equal')
    // if otp entered was valid
    return res.status(200).send({
      message: "OTP validated successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return res.status(500).send({
      message: "Error in validating otp",
      successs: false,
      error,
    });
  }
})
// const userEmailAddress = "sdshafin5421@gmail.com";
// const generatedOTP = generateOTP();

// sendOTPByEmail(userEmailAddress, generatedOTP)

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
}

app.listen(9090, () => {
  console.log(`server started at port 9090`);
});

// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URL);
//     console.log("connected to mongodb server");
//   } catch (error) {
//     console.log(`Mongo connect error ${error}`);
//   }
// };
// connectDB();