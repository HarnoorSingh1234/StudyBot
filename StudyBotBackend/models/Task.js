const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    title: { type: String, required: true },
    videoLink: { type: String },
    problemStatement: { type: String },
    optimalSolution: { type: String }
});

module.exports = mongoose.model('Task', taskSchema);
