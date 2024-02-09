const { deleteCommentById } = require('../controller/comment-controller');
const { addPost, getPostByUserId, getPostByPostId, deletPostById, updatePostData } = require('../controller/post-controller');
const Post = require('../model/post');

const verifyToken = require('../middlewares/token-verify');


const router = require('express').Router();


//GET Route

router.get('/dashboard',verifyToken,async (req, res) => {
    const posts = await Post.find({}).populate("createdBy");
    return res.render('./user/dashboard', {
        message:req.flash('message'),
        posts
    });
});
router.get('/add-post',verifyToken, (req, res) => {
    return res.render('./user/add-post', {
        message: req.flash('message')
    });
})
router.get('/get-post',verifyToken, getPostByUserId);

router.get('/:id',getPostByPostId);

router.get('/delete/:id',verifyToken, deletPostById);

router.get('/update/:id',verifyToken, async (req, res) => {
    const postId = req.params.id;
    const post = await Post.find({ _id: postId }); 
    return res.render('./user/update-post-detail', {
        post,
        message: req.flash('message')
    });
})
router.get("/comment/delete/:id",verifyToken, deleteCommentById);
//POST Route

router.post('/add-post',verifyToken, addPost);

router.post('/update/:id',verifyToken, updatePostData);
module.exports = router;