const express = require('express');
const router = express.Router();
const {
  getCodes,
  getArchivedCodes,
  getUserCodes,
  createCode,
  updateCode,
  archiveCode,
  unarchiveCode,
  deleteCode,
  copyCode,
  getStats,
} = require('../controllers/codeController');
const { protect } = require('../middleware/authMiddleware');

// Apply protect middleware to all routes
router.use(protect);

router.route('/')
  .get(getCodes)
  .post(createCode);

router.get('/archive', getArchivedCodes);
router.get('/user', getUserCodes);
router.get('/stats', getStats);

router.route('/:id')
  .put(updateCode)
  .delete(deleteCode);

router.put('/:id/archive', archiveCode);
router.put('/:id/unarchive', unarchiveCode);
router.post('/:id/copy', copyCode);

module.exports = router;