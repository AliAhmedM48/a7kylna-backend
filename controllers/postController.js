// Example post controller logic
const Post = require('../models/post');

// Get all posts
exports.getAllPosts = async (req, res) => {
    //#region 
    try {
        const posts = await Post.find().populate('owner');
        res.json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
    //#endregion
};

// Get a single post by ID
exports.getPostById = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await Post.findById(postId).populate('owner');;
        if (!post) {
            return res.status(404).send('Post not found');
        }
        res.json(post);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

// Create a new post
exports.createPost = async (req, res) => {
    try {
        const owner = req.user._id;
        if (!owner) throw new Error('Owner not found');

        const { title, content, image } = req.body;
        // Create a new post with provided data
        const newPost = new Post({ title, content, owner, image });
        await newPost.save();

        // Return the newly created post in the response
        res.status(201).json(newPost);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};


// Update a post
exports.updatePost = async (req, res) => {
    //#region 
    try {
        const { postId } = req.params;
        const { title, content, image } = req.body;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).send('Post not found');
        }
        // // Check if the authenticated user owns the post
        // if (String(post.userId) !== req.user._id) {
        //     return res.status(403).send('Unauthorized');
        // }
        post.title = title;
        post.content = content;
        post.image = image
        await post.save();
        res.json(post);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
    //#endregion
};

// Delete a post
exports.deletePost = async (req, res) => {
    //#region 
    try {
        const { postId } = req.params;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).send('Post not found');
        }
        // // Check if the authenticated user owns the post
        // if (String(post.userId) !== req.user._id) {
        //     return res.status(403).send('Unauthorized');
        // }
        await post.deleteOne({ postId })
        res.send('Post deleted successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
    //#endregion
};
