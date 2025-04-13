const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
    subject: String,
    from: String,
    date: String,
    body: String
});

module.exports = mongoose.model("Email", emailSchema);