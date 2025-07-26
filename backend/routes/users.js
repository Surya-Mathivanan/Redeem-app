const express = require('express');
const router = express.Router();
const {
  updateProfile,
  getSuspensionStatus,
  getUserActivity,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Apply protect middleware to all routes
router.use(protect);

router.put('/profile', updateProfile);
router.get('/suspension', getSuspensionStatus);
router.get('/activity', getUserActivity);

module.exports = router;