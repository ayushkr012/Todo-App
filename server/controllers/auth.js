import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import UserOtp from "../models/UserOtp.js";
import nodemailer from "nodemailer";
import OAtuh2Client from "google-auth-library";
import Admin from "../models/Admin.js";

const client = new OAtuh2Client.OAuth2Client(process.env.Google_Client_Id);

/* Register a New User */
export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, imgUrl } = req.body;
    if (!firstName || !lastName || !email || !password || !imgUrl) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // Validate first name and last name (should be at least 2 characters long)
    if (firstName.length < 2 || lastName.length < 2) {
      return res.status(400).json({
        success: false,
        message: "First name and last name must be at least 2 characters long",
      });
    }
    // Validate password (should be at least 6 characters long)
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    // Check if the user already exists with the provided email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email is already in use. Please choose another email.",
      });
    }

    /* Hash the user password */
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      picturePath: imgUrl,
    });

    const savedUser = await newUser.save();
    res.status(201).json({
      success: true,
      message: "Registration Successful! ",
      savedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
/* Login a User */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    // Check if user exists
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User Not Found! Please Continue to Register",
      });
    }

    if (!user.password) {
      return res.status(400).json({
        success: false,
        message: "User Register with Google! Please Continue to Google Login",
      });
    }
    // Check if password is correct
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Credentials" });
    }

    // Create and assign a token
    const payload = {
      id: user._id,
      email: user.email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    delete user.password;
    return res
      .status(200)
      .json({ success: true, message: "Login Successfull!", user, token });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

/* Send OTP to User Email */
export const sendOtp = async (req, res) => {
  try {
    const tarnsporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const { email } = req.body;
    const user = await User.findOne({ email: email });

    // when user not registered and try to login
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User Not Found! Please Continue to Register",
      });
    }

    const OTP = Math.floor(100000 + Math.random() * 900000);
    console.log(OTP);

    const existEmail = await UserOtp.findOne({ email: email });
    // when user already exist in UserOtp collection then update the existing  OTP
    if (existEmail) {
      const updatedOtp = await UserOtp.findOneAndUpdate(
        { email: email },
        { otp: OTP },
        { new: true }
      );

      await updatedOtp.save();

      const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Todo App User Verification",
        html: `
    <html>
      <head>
        <style>
          .container {
            font-family: Arial, sans-serif;
            padding: 20px;
          }
          .footer {
            background-color: #f8f8f8;
            padding: 20px;
            margin-top: 20px;
            border-top: 1px solid #ccc;
            font-size: 14px;
            color: #555;
          }
          .footer p {
            margin: 5px 0;
          }
          .footer a {
            color: #004aad;
            text-decoration: none;
            margin-right: 15px;
          }
          .footer a:hover {
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2 style="color: #004aad;">Todo App User Verification</h2>
          <p>Hello ${user.firstName} ${user.lastName},</p>
          <p>Your OTP for Account Verification is:</p>
          <div style="background-color: #f4f4f4; border-radius: 5px; padding: 10px; margin-bottom: 20px;">
            <h1 style="font-size: 36px; color: #004aad; margin: 0;">${OTP}</h1>
          </div>
          <p>This OTP is valid for 10 minutes only.</p>
        </div>
        <div class="footer">
          <p>
            <a href="#">About</a> | 
            <a href="#">Accessibility</a> | 
            <a href="#">Help Center</a>
          </p>
          <p>
            <a href="#">Privacy & Terms</a> | 
            <a href="#">Ad Choices</a> | 
            <a href="#">Advertising</a>
          </p>
          <p>
            <a href="#">Business Services</a> | 
            <a href="#">Get the Todo app</a>
          </p>
          <p>Todo App Corporation © 2024</p>
        </div>
      </body>
    </html>
  `,
      };

      tarnsporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("error", error);
          return res.status(400).json({
            success: false,
            message: "email not send",
            error: "email not send",
          });
        } else {
          console.log("Email sent", info.response);
          return res
            .status(200)
            .json({ success: true, message: "OTP sent Successfully !" });
        }
      });
    } else {
      const otpInfo = UserOtp({
        email,
        otp: OTP,
      });

      await otpInfo.save();

      const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Todo App User Verification",
        html: `
    <html>
      <head>
        <style>
          .container {
            font-family: Arial, sans-serif;
            padding: 20px;
          }
          .footer {
            background-color: #f8f8f8;
            padding: 20px;
            margin-top: 20px;
            border-top: 1px solid #ccc;
            font-size: 14px;
            color: #555;
          }
          .footer p {
            margin: 5px 0;
          }
          .footer a {
            color: #004aad;
            text-decoration: none;
            margin-right: 15px;
          }
          .footer a:hover {
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2 style="color: #004aad;">Todo App User Verification</h2>
          <p>Hello ${user.firstName} ${user.lastName} ,</p>
          <p>Your OTP for Account Verification is:</p>
          <div style="background-color: #f4f4f4; border-radius: 5px; padding: 10px; margin-bottom: 20px;">
            <h1 style="font-size: 36px; color: #004aad; margin: 0;">${OTP}</h1>
          </div>
          <p>This OTP is valid for 10 minutes only.</p>
        </div>
        <div class="footer">
          <p>
            <a href="#">About</a> | 
            <a href="#">Accessibility</a> | 
            <a href="#">Help Center</a>
          </p>
          <p>
            <a href="#">Privacy & Terms</a> | 
            <a href="#">Ad Choices</a> | 
            <a href="#">Advertising</a>
          </p>
          <p>
            <a href="#">Business Services</a> | 
            <a href="#">Get the Todo app</a>
          </p>
          <p>Todo App Corporation © 2024</p>
        </div>
      </body>
    </html>
  `,
      };

      tarnsporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("error", error);
          return res.status(400).json({
            success: false,
            message: "email not send",
            error: "email not send",
          });
        } else {
          console.log("Email sent", info.response);
          return res
            .status(200)
            .json({ success: true, message: "Email sent Successfully" });
        }
      });
    }
  } catch (err) {
    return res.status(400).json({
      success: false,
      error: err.message,
      message: "Internal Server Error",
    });
  }
};

/* Verify OTP */
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "All fields required!",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const otpVerification = await UserOtp.findOne({ email });

    if (!otpVerification || otpVerification.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Create and assign a token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user.password;

    return res.status(200).json({
      success: true,
      message: "Login successful!",
      user,
      token,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      error: err.message,
      message: "Internal Server Error",
    });
  }
};

/* Goolge Login */

export const googleLogin = async (req, res) => {
  try {
    const { tokenId } = req.body;
    console.log(req.body);

    // Verify the Google token Id
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.Google_Client_Id,
    });
    const { email_verified, name, email, picture } = ticket.getPayload();

    if (email_verified) {
      let user = await User.findOne({ email });

      const [firstName, ...lastNameArray] = name.split(" ");
      const lastName = lastNameArray.join(" ");

      if (user) {
        // Create and assign a token
        const payload = {
          id: user._id,
          email: user.email,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: "7d",
        });

        user = user.toObject();
        delete user.password; // Remove the password field
        return res
          .status(200)
          .json({ success: true, message: "Login Successful!", user, token });
      } else {
        const newUser = new User({
          firstName,
          lastName,
          email,
          picturePath: picture,
        });

        const savedUser = await newUser.save();

        // Create and assign a token
        const payload = {
          id: savedUser._id,
          email: savedUser.email,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: "7d",
        });

        const userWithoutPassword = savedUser.toObject();
        delete userWithoutPassword.password; // Remove the password field
        return res.status(200).json({
          success: true,
          message: "Login Successful!",
          user: userWithoutPassword,
          token,
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "Email not verified",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

/*Admin Login */
export const adminlogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email: email });
    // Check if admin exists
    if (!admin) {
      return res.status(400).json({
        success: false,
        message: "Admin Not Found! Please Contact the Super Admin to Register",
      });
    }
    if (password !== admin.password) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    // Create and assign a token
    const payload = {
      id: admin._id,
      email: admin.email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // remove the admin password before sending to the frontend
    const adminWithoutPassword = admin.toObject();
    delete adminWithoutPassword.password;

    return res.status(200).json({
      success: true,
      message: "Login Successful!",
      admin: adminWithoutPassword,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};
