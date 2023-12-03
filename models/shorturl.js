const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  id: Number,
  url: String,
});

const ShortUrl = mongoose.model('ShortUrl', schema);

module.exports = ShortUrl;