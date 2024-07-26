import User from "../models/User.js";

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

// Get all users

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    // Return the list of users
    res.status(200).json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
