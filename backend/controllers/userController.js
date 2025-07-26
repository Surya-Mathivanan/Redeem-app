const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const Suspension = require('../models/suspensionModel');
const MisuseLog = require('../models/misuseLogModel');
const Copy = require('../models/copyModel');
const RedeemCode = require('../models/redeemCodeModel');

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Update fields
  if (req.body.name) user.name = req.body.name;
  if (req.body.email) user.email = req.body.email;
  if (req.body.password) user.password = req.body.password;

  const updatedUser = await user.save();

  res.status(200).json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
  });
});

// @desc    Get user suspension status
// @route   GET /api/users/suspension
// @access  Private
const getSuspensionStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Check if user is suspended
  if (user.isSuspended && user.suspendedUntil > new Date()) {
    // Get the most recent suspension record
    const suspension = await Suspension.findOne({
      user: user._id,
      isActive: true,
      suspendedUntil: { $gt: new Date() },
    }).sort({ createdAt: -1 });

    res.status(200).json({
      isSuspended: true,
      suspendedUntil: user.suspendedUntil,
      reason: suspension ? suspension.reason : 'Violation of platform rules',
    });
  } else {
    // If suspension has expired, update user status
    if (user.isSuspended && user.suspendedUntil <= new Date()) {
      user.isSuspended = false;
      user.suspendedUntil = null;
      await user.save();

      // Update any active suspensions
      await Suspension.updateMany(
        { user: user._id, isActive: true },
        { isActive: false }
      );
    }

    res.status(200).json({
      isSuspended: false,
    });
  }
});

// @desc    Get user activity
// @route   GET /api/users/activity
// @access  Private
const getUserActivity = asyncHandler(async (req, res) => {
  // Get recent copies
  const recentCopies = await Copy.find({ user: req.user._id })
    .populate({
      path: 'redeemCode',
      select: 'title code user',
      populate: {
        path: 'user',
        select: 'name',
      },
    })
    .sort({ createdAt: -1 })
    .limit(10);

  // Get recent added codes
  const recentCodes = await RedeemCode.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .limit(10);

  res.status(200).json({
    recentCopies,
    recentCodes,
  });
});

module.exports = {
  updateProfile,
  getSuspensionStatus,
  getUserActivity,
};