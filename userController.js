const User = require('../models/User');

// GET /api/v1/users/profile
const getProfile = async (req, res) => {
  res.json({ success: true, user: req.user });
};

// PUT /api/v1/users/profile
const updateProfile = async (req, res) => {
  try {
    const { name, class: userClass, subjects } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, class: userClass, subjects },
      { new: true, runValidators: true }
    );
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/v1/users/change-password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+passwordHash');
    if (!(await user.comparePassword(currentPassword)))
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });

    user.passwordHash = newPassword;
    await user.save();
    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/v1/users/account
const deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    const Note = require('../models/Note');
    await Note.deleteMany({ userId: req.user._id });
    res.json({ success: true, message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getProfile, updateProfile, changePassword, deleteAccount };
