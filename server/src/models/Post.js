const mongoose = require('mongoose');


const postSchema = mongoose.Schema({

    name:{
        type: String,
        required: true,
    },
    bio:{
        type: String,
        required: true,
    },
    title:{
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: [String],
        default:[]
    },
    content:{
        type: String,
    },
    like: {
        type: Number,
        default: 0,
    },
    likeBy:{
        type: [String],
        default: [],
    },
    createdAt:{
        type: Date,
        default: new Date(), 
    }
})

module.exports = mongoose.model('Post', postSchema);
