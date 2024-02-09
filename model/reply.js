const mongoose = require('mongoose');



const replySchema = mongoose.Schema({
    replayText: {
        type: String,
        require: true,
        
    },
    commentOn: {
        type: mongoose.Types.ObjectId,
        ref: 'Comment'
    },
    postId: {
        type: mongoose.Types.ObjectId,
        ref: 'Post',
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    childID: {
        type: Array,
        default: []
    },
    createdAt: {
        type: String,
        require: true
    },
    isDelete: {
        type: Boolean,
        default:false
    },
    deletedAt: {
        type: String,
    }
}, { timestamps: true });

module.exports = mongoose.model("Reply", replySchema);