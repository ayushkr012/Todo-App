import mongoose from "mongoose";
const { Schema } = mongoose;

const UserOtpSchema = new Schema({
  email: {
    type: String,
    required: true,
    trim: true,
  },
  otp: {
    type: String,
    required: true,
    trim: true,
  },
});

const UserOtp = mongoose.model("UserOtp", UserOtpSchema);
export default UserOtp;
