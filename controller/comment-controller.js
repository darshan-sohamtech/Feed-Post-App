let Comment = require('../model/comment');
let Post = require('../model/post');
let Reply = require('../model/reply');

let addComment = async (req, res) => {
    try {
        let postId = req.params.id;
        let userId = req.user._id;
        let commentText = req.body.commentText;

        let date = new Date();
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let seconds = date.getSeconds();
        let formattedTime = `${hours}:${minutes}:${seconds}`;

        let newComment = new Comment({
            postOn: postId,
            commentText,
            createdBy: userId,
            createdAt: formattedTime
        })
        await newComment.save();
        req.flash("message", "Comment Added");
        return res.redirect(`/post/${req.params.id}`);
    } catch (error) {
        console.log(error);
        return res.render('./error/500-page');
    }
}


let deleteCommentById = async (req, res) => {
    try {
        let comment = {
            id: req.params.id,
        }
        let cmnt = await Comment.findByIdAndUpdate({ _id: comment.id }, {
            $set: {
                isDelete: true,
                deletedAt: new Date(),
                replies: []
            }
        });
        
        let checkChildAndRemove = async (cmnt) => {
            if (cmnt.replies.length !== 0) {
                for (const i of cmnt.replies) {
                    const reply = await Reply.findByIdAndUpdate({ _id: i }, {
                        $set: {
                            deletedAt: new Date(),
                            childID: [],
                            isDeleted:true
                        }
                    });
                    let checkChildAndRemove = async (reply) => {
                        if (reply.childID.length !== 0) {
                            for (let i of reply.childID) {
                                let childData = await Reply.findByIdAndUpdate({ _id: i }, {
                                    $set: {
                                        deletedAt: new Date(),
                                        childID: [],
                                        isDeleted:true
                                    }
                                });
                                await checkChildAndRemove(childData);
                            }
                        }
                    }
                    await checkChildAndRemove(reply);
                    
                }
            }
            
        }
        await checkChildAndRemove(cmnt);

        let posts = await Post.find({ _id: cmnt.postOn });
        let post = posts[0];
        req.flash("message", "Comment Deleted...");
        return res.redirect(`/post/${post._id}`);
    } catch (error) {
        console.log(error);
        return res.render('./error/500-page');
    }
}

let addCommentReplay = async (req, res) => {
    try {
        let commnetId = req.params.cId;
        let rText = req.body.replyText;

        let date = new Date();
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let seconds = date.getSeconds();
        let formattedTime = `${hours}:${minutes}:${seconds}`;

        let rep = await Reply.findById({ _id: commnetId });
        let cmnt = await Comment.findById({ _id: commnetId });
        
        if (!cmnt) {
            let post = await Post.findById({ _id: rep.postId });
            let newReply = new Reply({
                replayText: rText,
                commentOn: commnetId,
                createdBy: req.user._id,
                createdAt: formattedTime,
                postId: post._id,
                
            });
            await newReply.save();
            await rep.childID.push(newReply._id);
            await rep.save();
            req.flash("message", "Comment Added");
            return res.redirect(`/post/${post._id}`);
        }
        else {
            let post = await Post.findById({ _id: cmnt.postOn });
            let newReply = new Reply({
                replayText: rText,
                commentOn: commnetId,
                createdBy: req.user._id,
                createdAt: formattedTime,
                postId: post._id,
            })
            await newReply.save();
            await cmnt.replies.push(newReply._id);
            await cmnt.save();
            req.flash("message", "Comment Added");
            return res.redirect(`/post/${post._id}`);
            
        }
    } catch (error) {
        console.log(error);
        return res.render('./error/500-page');
    }
};


let deleteReply = async (req, res) => {
    try {

        let replyId = req.params.id;
        let reply = await Reply.findByIdAndUpdate({ _id: replyId }, {
            $set: {
                childID: [],
                isDelete:true,
                deletedAt: new Date()
            }
        });
        let parentReply = await Reply.findById({ _id: reply.commentOn });
        let parentComment = await Comment.findById({ _id: reply.commentOn });
        
        if (!parentReply) {
            parentComment.replies.pull(reply._id);
            await parentComment.save();

        } else {
            parentReply.childID.pull(reply._id);
            await parentReply.save();
            let preParentReplay = await Reply.findById({ _id: parentReply.commentOn });
            
            if (!preParentReplay) {
                let preParentComment = await Comment.findById({ _id: parentReply.commentOn });

                let checkAndUpdate = async (reply) => {
                    if (reply.childID.length !== 0) {
                        for (let i of reply.childID) {
                            let childData = await Reply.findByIdAndUpdate({ _id: i }, {
                                $set: {
                                    commentOn: preParentComment.postOn
                                }
                            })
                            
                            await preParentComment.replies.push(childData._id);
                            await preParentComment.save();
                        }
                    }
                }
                await checkAndUpdate(reply);
            } else {
                
                let checkAndUpdate = async (reply) => {
                    if (reply.childID.length !== 0) {
                        for (let i of reply.childID) {
                            let childData = await Reply.findByIdAndUpdate({ _id: i }, {
                                $set: {
                                    commentOn: parentReply.commentOn
                                }
                            });
                            
                            await preParentReplay.childID.push(childData._id);
                            await preParentReplay.save();
                        }
                    }
                }
                await checkAndUpdate(reply);
            }
        }
        

        let posts = await Post.find({ _id: reply.postId });
        let post = posts[0];
        req.flash("message", "Comment Deleted...");
        return res.redirect(`/post/${post._id}`);
        
    } catch (error) {
        console.log(error);
        return res.render('./error/500-page');
    }
}

module.exports = { addComment, deleteCommentById ,addCommentReplay ,deleteReply}