const mongoose = require('mongoose')

const fileSchema1 = new mongoose.Schema({
    userid: String,
    Strength: Number,
    Defense: Number,
    Agility: Number,
    Magic: Number,
    Money: Number,
    Achievements: Array,
    Inventory: Array,
    Slaves: Object,
})

const fileSchema = module.exports = mongoose.model('accounts', fileSchema1)