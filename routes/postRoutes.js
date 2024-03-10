const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/', postController.getAllPosts);
router.get('/:postId', postController.getPostById);
router.post('/', protect, postController.createPost);
router.put('/:postId', protect, postController.updatePost);
router.delete('/:postId', protect, postController.deletePost);

module.exports = router;
