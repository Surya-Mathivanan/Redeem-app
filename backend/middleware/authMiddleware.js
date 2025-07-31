const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const Suspension = require('../models/suspensionModel');

// Protect routes
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        res.status(401);
        throw new Error('Not authorized, user not found');
      }

      // Check if user is suspended
      if (req.user.isSuspended && req.user.suspendedUntil > new Date()) {
        const suspensionDate = new Date(req.user.suspendedUntil);
        const formattedDate = suspensionDate.toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
        res.status(403);
        throw new Error(`Your account is suspended until ${formattedDate}`);
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

// Check for rapid copying pattern
const checkRapidCopying = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
  
  // Get recent copies by this user
  const Copy = require('../models/copyModel');
  const recentCopies = await Copy.find({
    user: userId,
    createdAt: { $gte: twoMinutesAgo }
  }).sort({ createdAt: -1 }).limit(5);
  
  if (recentCopies.length >= 3) {
    // Check if any 3 consecutive copies were within a short time
    let rapidSequences = 0;
    
    for (let i = 0; i < recentCopies.length - 2; i++) {
      const time1 = recentCopies[i].createdAt;
      const time2 = recentCopies[i + 1].createdAt;
      const time3 = recentCopies[i + 2].createdAt;
      
      // Check if all 3 copies happened within 60 seconds total
      if ((time1 - time3) / 1000 <= 60) {
        // Check if any two consecutive copies were within 20 seconds
        if ((time1 - time2) / 1000 <= 20 || (time2 - time3) / 1000 <= 20) {
          rapidSequences += 1;
        }
      }
    }
    
    if (rapidSequences >= 1) {
      // Log the misuse activity
      const MisuseLog = require('../models/misuseLogModel');
      await MisuseLog.create({
        user: userId,
        actionType: 'RAPID_COPYING',
        details: `User made ${recentCopies.length} copies in the last 2 minutes with rapid sequences detected.`
      });
      
      // Suspend the user
      const suspensionDuration = 30 * 60 * 1000; // 30 minutes
      const suspendedUntil = new Date(Date.now() + suspensionDuration);
      
      // Update user suspension status
      await User.findByIdAndUpdate(userId, {
        isSuspended: true,
        suspendedUntil
      });
      
      // Create suspension record
      await Suspension.create({
        user: userId,
        reason: 'Rapid copying pattern detected',
        suspendedUntil,
        isActive: true
      });
      
      const formattedDate = suspendedUntil.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      res.status(403);
      throw new Error(`Your account has been suspended for 30 minutes due to rapid copying pattern. Please try again after ${formattedDate}.`);
    }
  }
  
  next();
});

module.exports = { protect, checkRapidCopying };