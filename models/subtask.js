const mongoose = require('mongoose');

const subtaskSchema = mongoose.Schema({
    name: { type: String, required: true}
});

module.exports = mongoose.model('Subtask', subtaskSchema);