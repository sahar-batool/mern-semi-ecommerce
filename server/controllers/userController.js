const User = require('../Models/User');

const getUserProfile = async (req, res) => {
  res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  });
};


//updation of user profile
const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.name = req.body.name || user.name;

  const updatedUser = await user.save();

  res.status(200).json({
    success: true,
    user: {
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
    },
  });
};


const getUsers = async (req, res) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    count: users.length,
    users,
  });
};


const getUserById = async(req, res)=> {
    const user = await User.findById(req.params.id)

  if(!user) {
    res.status(401);
    throw new Error('User not found');
  }

  res.status(200).json({
    success: true,
    user,
  });
};


module.exports = { getUserProfile, updateUserProfile, getUsers, getUserById};