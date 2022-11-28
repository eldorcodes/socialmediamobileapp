const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Schema({
    otherUserId:{
        type:String
    },
    currentUserId:{
        type:String
    },
    date:{
        type:Date,
        default:Date.now
    },
    message:{
        type:String
    },
    uid:{
        type:String
    },
    otherUser:{
        type:Object
    },
    currentUser:{
        type:Object
    },
    image:{
        type:String
    },
    isRead:{
        type:Boolean
    }
})

module.exports = mongoose.model('Chat',chatSchema);