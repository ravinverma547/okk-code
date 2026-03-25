const StudyMaterial = require('../models/StudyMaterial');
const asyncHandler = require('express-async-handler');
const sendResponse = require('../utils/apiResponse');
const fs = require('fs');
const path = require('path');

/**
 * @desc    Upload study material
 * @route   POST /api/v1/study-materials
 * @access  Private (Teacher/Admin)
 */
const uploadMaterial = asyncHandler(async (req, res) => {
    if (!req.file) {
        res.status(400);
        throw new Error('Please upload a file');
    }

    const { title, description, subject, course, fileType } = req.body;

    const material = await StudyMaterial.create({
        title,
        description,
        subject,
        course,
        fileType: fileType || 'PDF',
        fileUrl: `/uploads/study-materials/${req.file.filename}`,
        uploadedBy: req.user._id
    });

    sendResponse(res, 201, 'Study material uploaded successfully', material);
});

/**
 * @desc    Get all study materials
 * @route   GET /api/v1/study-materials
 * @access  Private
 */
const getAllMaterials = asyncHandler(async (req, res) => {
    const { subject, course } = req.query;
    const query = {};
    if (subject) query.subject = subject;
    if (course) query.course = course;

    const materials = await StudyMaterial.find(query)
        .populate('uploadedBy', 'name')
        .populate('course', 'name')
        .sort('-createdAt');

    sendResponse(res, 200, 'Materials retrieved successfully', materials);
});

/**
 * @desc    Delete study material
 * @route   DELETE /api/v1/study-materials/:id
 * @access  Private (Teacher/Admin)
 */
const deleteMaterial = asyncHandler(async (req, res) => {
    const material = await StudyMaterial.findById(req.params.id);

    if (!material) {
        res.status(404);
        throw new Error('Material not found');
    }

    // Only creator or admin can delete
    if (material.uploadedBy.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
        res.status(403);
        throw new Error('Not authorized to delete this material');
    }

    // Delete file from storage
    const filePath = path.join(__dirname, '../..', material.fileUrl);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }

    await material.deleteOne();
    sendResponse(res, 200, 'Material deleted successfully');
});

module.exports = {
    uploadMaterial,
    getAllMaterials,
    deleteMaterial
};
