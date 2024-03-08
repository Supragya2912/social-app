const Post = require('../models/Post');
const User = require('../models/User');

const createPost = async (req, res, next) => {
    try {
        const { name, bio, title, description, content, image } = req.body;

        if (!name || !bio || !title || !description) {
            return res.status(400).json({ message: 'Title and description are required' });
        }
        let postContent;
        if (content) {
            postContent = content;
        } else if (image) {
            postContent = image;
        } else {
            return res.status(400).json({ message: 'Either content or image is required' });
        }

        const newPost = new Post({
            name: name,
            bio: bio,
            title: title,
            description: description,
            [content ? 'content' : 'image']: postContent,
            like: 0,
        });

        await newPost.save();

        res.status(200).json({
            success: true,
            message: 'Post created successfully',
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong !!'
        });
    }
};

const getPosts = async (req, res) => {
    try {
        let { page, limit = 100 } = req.query;
        page = parseInt(page,10);
        limit = parseInt(limit,10);
        
        const offset = (page - 1) * limit;

        const totalCount = await Post.countDocuments();
        const totalPages = Math.ceil(totalCount / limit)
        const posts = await Post.find().skip(offset).limit(limit);

        res.status(200).json({
            success: true,
            totalPages: totalPages,
            currentPage: page,
            posts: posts
            
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong !!'
        });
    }
}

const getPost = async (req, res, next) => {

    try {

        const { id } = req.query;
        const post = await Post.findById({_id: id});
        res.status(200).json({
            success: true,
            post: post
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong !!'
        });
    }
}

const addLike = async (req, res, next) => {
    try {
        const { id } = req.body;
        const userID = req.user._id;
        const post = await Post.findById(id);

        if (!post) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid post'
            });
        }

       
        if (post.likeBy.includes(userID)) {
            post.likeBy = post.likeBy.filter((uid) => uid.toString() !== userID.toString());
            post.like = post.likeBy.length;
            await post.save();
            return res.status(200).json({
                success: true,
                message: 'UnLike added successfully'
            });
        }

        
        post.likeBy.push(userID);
        post.like = post.likeBy.length; 
        await post.save();

        res.status(200).json({
            success: true,
            message: 'Like added successfully'
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong'
        });
    }
}




module.exports = {
    createPost,
    getPosts,
    getPost,
    addLike,
   
}