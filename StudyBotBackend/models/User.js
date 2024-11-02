const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firebaseUID: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, default: 'user' },
});

module.exports = mongoose.model('User', userSchema);
