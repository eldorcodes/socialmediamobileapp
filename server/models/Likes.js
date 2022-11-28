const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const likeSchema = new Schema({
    postId:{
        type:String
    },
    userUID:{
        type:String
    },
    date:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model('Like',likeSchema);