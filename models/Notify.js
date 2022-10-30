const mongoose = require('mongoose')

const notifySchema = new mongoose.Schema({
    user: {type: mongoose.Types.ObjectId, ref: 'user'},
    url: String,
    text: String,
    content: String,
    image: String,
    isRead: {type: Boolean, default: false}
}, {
    timestamps: true
})

module.exports = mongoose.model('Notify', notifySchema)