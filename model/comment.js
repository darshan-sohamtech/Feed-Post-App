const mongoose = require('mongoose');



const commentSchema = mongoose.Schema({
    postOn: {
        type: mongoose.Types.ObjectId, 
        ref: 'Post',
    },
    commentText: {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Types.ObjectId,  
        ref: 'User',
    },
    createdAt: {
        type: String,
        require:true
    },
    replies: {
        type: Array,
        default:[]
    },
    isDelete: {
        type: Boolean,
        default:false
    },
    deletedAt: {
        type: String,
        default: null
    }
},{timestamps:true})

module.exports = mongoose.model('Comment', commentSchema);