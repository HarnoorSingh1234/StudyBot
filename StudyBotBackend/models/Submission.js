const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
    solutionCode: { type: String, required: true },
    status: { type: String, default: 'pending' },
    feedback: { type: String }
});

module.exports = mongoose.model('Submission', submissionSchema);
