const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    gender: {
        type: String
    },
    facebook_url: {
        type: String
    },
    twitter_url: {
        type: String
    },
    linkedin_url: {
        type: String
    },
    country: {
        type: String
    },
    city: {
        type: String
    },
    image: {
        type: String
    }
})

module.exports = Item = mongoose.model('item', ItemSchema);