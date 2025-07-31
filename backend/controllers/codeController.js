const asyncHandler = require('express-async-handler');
const RedeemCode = require('../models/redeemCodeModel');
const Copy = require('../models/copyModel');
const { checkRapidCopying } = require('../middleware/authMiddleware');

// @desc    Get all redeem codes
// @route   GET /api/codes
// @access  Private
const getCodes = asyncHandler(async (req, res) => {
  const codes = await RedeemCode.find({
    isArchived: false,
    copyCount: { $lte: 4 }
  })
    .populate('user', 'name')
    .sort({ copyCount: 1 });

  const userCopies = await Copy.find({ user: req.user._id }).select('redeemCode');
  const userCopiedCodeIds = userCopies.map(copy => copy.redeemCode.toString());

  const formattedCodes = codes.map(code => {
    return {
      _id: code._id,
      title: code.title,
      code: code.code,
      user: {
        _id: code.user._id,
        name: code.user.name
      },
      createdAt: code.createdAt,
      copyCount: code.copyCount,
      hasCopied: userCopiedCodeIds.includes(code._id.toString())
    };
  });

  res.status(200).json(formattedCodes);
});

// @desc    Get archived redeem codes
// @route   GET /api/codes/archive
// @access  Private
const getArchivedCodes = asyncHandler(async (req, res) => {
  const codes = await RedeemCode.find({
    user: req.user._id,
    isArchived: true
  }).sort({ createdAt: -1 });

  res.status(200).json(codes);
});

// @desc    Get user's redeem codes
// @route   GET /api/codes/user
// @access  Private
const getUserCodes = asyncHandler(async (req, res) => {
  const codes = await RedeemCode.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json(codes);
});

// @desc    Create new redeem code
// @route   POST /api/codes
// @access  Private
const createCode = asyncHandler(async (req, res) => {
  const { title, code } = req.body;

  if (!title || !code) {
    res.status(400);
    throw new Error('Please add a title and code');
  }

  const redeemCode = await RedeemCode.create({
    title,
    code,
    user: req.user._id,
  });

  res.status(201).json(redeemCode);
});

// @desc    Update a redeem code
// @route   PUT /api/codes/:id
// @access  Private
const updateCode = asyncHandler(async (req, res) => {
  const code = await RedeemCode.findById(req.params.id);

  if (!code) {
    res.status(404);
    throw new Error('Code not found');
  }

  if (code.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to update this code');
  }

  const updatedCode = await RedeemCode.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.status(200).json(updatedCode);
});

// @desc    Archive a redeem code
// @route   PUT /api/codes/:id/archive
// @access  Private
const archiveCode = asyncHandler(async (req, res) => {
  const code = await RedeemCode.findById(req.params.id);

  if (!code) {
    res.status(404);
    throw new Error('Code not found');
  }

  if (code.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to archive this code');
  }

  code.isArchived = true;
  await code.save();

  res.status(200).json({ message: 'Code archived successfully' });
});

// @desc    Unarchive a redeem code
// @route   PUT /api/codes/:id/unarchive
// @access  Private
const unarchiveCode = asyncHandler(async (req, res) => {
  const code = await RedeemCode.findById(req.params.id);

  if (!code) {
    res.status(404);
    throw new Error('Code not found');
  }

  if (code.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to unarchive this code');
  }

  code.isArchived = false;
  await code.save();

  res.status(200).json({ message: 'Code unarchived successfully' });
});

// @desc    Delete a redeem code
// @route   DELETE /api/codes/:id
// @access  Private
const deleteCode = asyncHandler(async (req, res) => {
  const code = await RedeemCode.findById(req.params.id);

  if (!code) {
    res.status(404);
    throw new Error('Code not found');
  }

  if (code.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to delete this code');
  }

  await code.remove();

  res.status(200).json({ id: req.params.id });
});

// @desc    Copy a redeem code
// @route   POST /api/codes/:id/copy
// @access  Private
const copyCode = asyncHandler(async (req, res) => {
  await checkRapidCopying(req, res, async () => {
    const code = await RedeemCode.findById(req.params.id);

    if (!code) {
      res.status(404);
      throw new Error('Code not found');
    }

    const existingCopy = await Copy.findOne({
      user: req.user._id,
      redeemCode: code._id,
    });

    if (existingCopy) {
      res.status(400);
      throw new Error('You have already copied this code');
    }

    await Copy.create({
      user: req.user._id,
      redeemCode: code._id,
    });

    code.copyCount += 1;

    // ✅ Archive the code if it reaches 5 copies
    if (code.copyCount >= 5) {
      code.isArchived = true;
    }

    await code.save();

    res.status(200).json({
      message: 'Code copied successfully',
      code: code.code,
      copyCount: code.copyCount,
    });
  });
});

// @desc    Get dashboard statistics
// @route   GET /api/codes/stats
// @access  Private
const getStats = asyncHandler(async (req, res) => {
  const addedCodes = await RedeemCode.countDocuments({ user: req.user._id });
  const totalCopies = await Copy.countDocuments({ user: req.user._id });

  res.status(200).json({
    addedCodes,
    totalCopies,
  });
});

module.exports = {
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
};
