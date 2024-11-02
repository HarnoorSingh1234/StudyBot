const User = require('../models/User.js');

exports.createUser = async (req, res) => {
    try {
        const { firebaseUID, username, email } = req.body;
        const user = new User({ firebaseUID, username, email });
        await user.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create user' });
    }
};
