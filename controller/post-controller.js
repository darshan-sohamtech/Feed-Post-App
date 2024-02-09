let Post = require('../model/post');
let Comment = require('../model/comment');
let Reply = require('../model/reply');

let addPost = async (req, res) => {
    try {
        let { postname, description } = req.body;
        try {
            let date = new Date();
            let hours = date.getHours();
            let minutes = date.getMinutes();
            let seconds = date.getSeconds();
            let formattedTime = `${hours}:${minutes}:${seconds}`;

            await Post.create({
                postname,
                description,
                createdBy: req.user._id,
                createdAt: formattedTime
            })
            req.flash("message", "Post Added Successfully...")
            return res.render('./user/add-post', {
                message: req.flash('message')
            });
        } catch (error) {
            req.flash("message", "Post Not Added Successfully...");
            return res.render('./user/add-post', {
                message:req.flash('message')
            });
        }
        

    } catch (error) {
        console.log(error);
        return res.render('./error/500-page');
    }
}

let getPostByUserId = async (req, res) => {
    try {
        let userId = req.user._id;
        let posts = await Post.find({$and:[{ createdBy: userId },{isDelete:false}]}).populate("createdBy");
        
        return res.render('./user/get-all-post-by-userid', {
            message:req.flash('message'),
            posts
        })
    } catch (error) {
        console.log(error);
        return res.render('./error/500-page');
    }
}

let getPostByPostId = async (req, res) => {
    try {
        let postId = req.params.id;
        let post = await Post.findById({_id: postId}).populate("createdBy");
        let comments = await Comment.find({$and:[{postOn: postId},{isDelete :false}]  }).populate("createdBy").sort({ createdAt: -1 }).populate("replies");
        let replys = await Reply.find({$and:[{postId: postId},{isDelete :false}]  }).populate("createdBy").sort({ createdAt: -1 });
        
        return res.render('./user/get-post-by-id', {
            message:req.flash('message'),
            post,
            user: req.user,
            comments,
            replys
        })
    } catch (error) {
        console.log(error);
        return res.render('./error/500-page');
    }
}

let deletPostById = async (req, res) => {
    try {
        let postId = req.params.id;
        await Post.findByIdAndUpdate({ _id: postId }, {
            $set: {
                deletedAt: new Date(),
                isDelete:true
            }
        });
        await Comment.updateMany({ postOn: postId }, {
            $unset: {
                postOn: 1,
                createdBy: 1,
                replies: 1
            },
            $set: {
                deletedAt: new Date()
            }
        });
        await Reply.updateMany({ postId: postId }, {
            $unset: {
                commentOn: "deleted",
                postId: "deleted",
                createdBy: "deleted",
                childID: [],
            
            },
            $set: {
                deletedAt: new Date()
            }
        });
        

        let userId = req.user._id;
        let posts = await Post.find({ createdBy: userId }).populate("createdBy");
        req.flash('message', 'Post Delete Successfully...');
        return res.render('./user/get-all-post-by-userid', {
            message: req.flash('message'),
            posts
        });
    } catch (error) {
        console.log(error);
        return res.render('./error/500-page');
    }
}

let updatePostData = async (req, res) => {
    try {
        let postId = req.params.id;
            await Post.updateOne({_id:postId},{ $set: {
                postname:req.body.postname,
                description:req.body.description,
            }
            })
            await Post.find({});
            req.flash("message", "Post Updated...");
            return res.redirect(`/post/${req.params.id}`);
    } catch (error) {
        console.log(error);
        return res.render('./error/500-page');
    }
}

module.exports = { addPost, getPostByUserId, getPostByPostId, deletPostById, updatePostData }