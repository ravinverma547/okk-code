const express = require('express');
const router = express.Router();
const { 
    uploadMaterial, 
    getAllMaterials, 
    deleteMaterial 
} = require('../controllers/studyMaterialController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.use(protect);

router.post('/', authorize('ADMIN', 'TEACHER'), upload.single('file'), uploadMaterial);
router.get('/', getAllMaterials);
router.delete('/:id', authorize('ADMIN', 'TEACHER'), deleteMaterial);

module.exports = router;
