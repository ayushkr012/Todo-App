import User from "../models/User.js";
import Task from "../models/Task.js";
import nodemailer from "nodemailer";

/* Get User details  */

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* Get all users */

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    // Return the list of users
    res.status(200).json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* Delete User */

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const { email, firstName, lastName } = user;

    // Delete the user and all tasks associated with the user
    await User.findByIdAndDelete(id);
    await Task.deleteMany({ userId: id });

    // inform user to their account is deleted by the admin
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Todo App Account Deletion Notification",
      html: `
    <html>
      <head>
        <style>
          .container {
            font-family: Arial, sans-serif;
            padding: 20px;
          }
          .header {
            background-color: #f4f4f4;
            padding: 10px;
            border-bottom: 1px solid #ddd;
            margin-bottom: 20px;
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
          <div class="header">
            <h2 style="color: #d9534f;">Todo App Account Deletion</h2>
          </div>
          <p>Hello ${firstName} ${lastName},</p>
          <p>We regret to inform you that your account has been deleted by the admin. If you believe this is a mistake or if you have any questions, please contact our support team.</p>
          <p>If you have any issues, feel free to reach out to us.</p>
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

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });

    const users = await User.find();
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
