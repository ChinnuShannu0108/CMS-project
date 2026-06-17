const Post = require('../models/Post');

// @desc Create new post
// @route POST /api/posts
exports.createPost = async (req, res) => {
  try {
    if (req.user.role === 'viewer') {
      return res.status(403).json({ message: 'Viewers cannot create posts' });
    }

    const { title, content, category, status, image } = req.body;

    const post = await Post.create({
      title,
      content,
      category,
      status,
      image,
      author: req.user._id,
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get all posts
// @route GET /api/posts
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'name email');
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Get all posts (logged-in user's posts only)
exports.getMyPosts = async (req, res) => {
  try {
    let posts;
    if (req.user.role === 'admin' || req.user.role === 'viewer') {
      // Admin & Viewer ki anni posts
      posts = await Post.find().populate('author', 'name email');
    } else {
      // Editor ki own posts matrame
      posts = await Post.find({ author: req.user._id }).populate('author', 'name email');
    }
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// @desc Get single post
// @route GET /api/posts/:id
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'name email');
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update post
// @route PUT /api/posts/:id
exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // Viewer cannot edit
    if (req.user.role === 'viewer') {
      return res.status(403).json({ message: 'Viewers cannot edit posts' });
    }

    // Non-admin can only edit their own posts
    if (req.user.role !== 'admin' && post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only edit your own posts' });
    }

    post.title = req.body.title || post.title;
    post.content = req.body.content || post.content;
    post.category = req.body.category || post.category;
    post.status = req.body.status || post.status;
    post.image = req.body.image || post.image;

    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete post
// @route DELETE /api/posts/:id
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // Viewer cannot delete
    if (req.user.role === 'viewer') {
      return res.status(403).json({ message: 'Viewers cannot delete posts' });
    }

    // Non-admin can only delete their own posts
    if (req.user.role !== 'admin' && post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only delete your own posts' });
    }

    await post.deleteOne();
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};