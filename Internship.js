const mongoose = require('mongoose');

// This defines what an internship posting looks like in the database.
const internshipSchema = new mongoose.Schema({
    // Store a reference to the company that created this posting
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company', // Links this to the 'Company' model
        required: true
    },
    companyName: {
        type: String,
        required: true // Store the name redundantly for faster display
    },
    title: {
        type: String,
        required: true
    },
    location: {
        type: String,
        default: 'Remote'
    },
    stipend: {
        type: String,
        default: 'Unpaid'
    },
    duration: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    // Track when the internship was posted
    postedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Internship', internshipSchema);
