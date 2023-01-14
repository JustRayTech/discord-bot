const mongoose = require('mongoose')

const fileSchema1 = new mongoose.Schema({
    company: String,
    currentPrice: Number,
    price1HrAgo: Number,
    price2HrAgo: Number,
    price3HrAgo: Number,
    price4HrAgo: Number,
    price5HrAgo: Number,
    price6HrAgo: Number,
    price7HrAgo: Number,
    price8HrAgo: Number,
})

const fileSchema = module.exports = mongoose.model('stockPrices', fileSchema1)