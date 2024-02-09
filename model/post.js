const mongoose = require('mongoose');



const postSchema = new mongoose.Schema({
    postname: {
        type: String,
        required: true
    },
    description: {
        type: String,
        require:true
    },
    createdBy: {
        type: mongoose.Types.ObjectId,  
        ref: 'User',
    },
    createdAt: {
        type: String,
        require:true
    },
    isDelete: {
        type: Boolean,
        default:false
    },
    deletedAt: {
        type:String
    }
},{timestamps:true})

module.exports = mongoose.model('Post',postSchema);