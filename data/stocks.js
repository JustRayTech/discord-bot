const mongoose = require('mongoose')

const fileSchema1 = new mongoose.Schema({
    userid: String,
    stocks1: Boolean,
    stake1: Number,
    stocks2: Boolean,
    stake2: Number,
})

const fileSchema = module.exports = mongoose.model('stocks', fileSchema1)