import nodemailer from "nodemailer";
import Admin from "../models/Admin.js";

/* Add Admin */
export const addAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the admin
    const Check = await Admin.findOne({ email });

    if (Check) {
      return res
        .status(400)
        .json({ success: false, message: "Admin already exists" });
    }

    // Default values
    const firstName = "Admin";
    const lastName = "Panel";
    const superAdmin = false;

    // Create a new admin
    const admin = await Admin.create({
      firstName,
      lastName,
      email,
      password,
      superAdmin,
    });

    // Send notification email
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
      subject: "Todo App Admin Status Change Notification",
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
                <h2 style="color: #d9534f;">Todo App Admin Status Change</h2>
              </div>
              <p>Hello</p>
              <p>We are pleased to inform you that you have been assigned to an admin position at Todo App. If you have any questions or need assistance, please contact our support team.</p>
              <p>Your email is: ${email}</p>
              <p>Your password is: ${password}</p>
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
    res
      .status(201)
      .json({ success: true, message: "Admin Added SuccessFully!" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* Delete | Remove Admin */
export const removeAdmin = async (req, res) => {
  try {
    const { email } = req.body;

    // Find the admin
    const admin = await Admin.findOne({ email });

    // Check if the admin exists
    if (!admin) {
      return res
        .status(404)
        .json({ success: false, message: "Admin not found" });
    }

    // Delete the admin
    await Admin.deleteOne({ email });

    // after deleting the admin, notify the user you have been remove from the admin
    // Send notification email
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
      subject: "Todo App Admin Status Change Notification",
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
                <h2 style="color: #d9534f;">Todo App Admin Status Change</h2>
              </div>
              <p>Hello,</p>
              <p>We want to inform you that your admin status has been removed. If you have any questions or concerns, please contact our support team.</p>
              <p>Your email was: ${email}</p>
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

    res
      .status(200)
      .json({ success: true, message: "Admin deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
