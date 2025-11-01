const mongoose = require('mongoose');

// Defines the structure for a company profile in the database.
const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensures no two companies can register with the same email
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  // We can add other fields later, like industry, description, etc.
});

module.exports = mongoose.model('Company', companySchema);