const mongoose = require('mongoose');

const ResponseSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true, 
      minlength: 2 // Minimum length for name 
    },
    email: { 
      type: String, 
      required: true, 
      match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/ // Email format validation 
    },
    formId: { 
      type: String, 
      required: true, 
      index: true // Add index for faster queries 
    },
    response: {
      type: Array,
      required: true,
      validate: {
        validator: (value) => Array.isArray(value) && value.length > 0, // Ensure non-empty array
        message: "Response must be a non-empty array",
      },
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
    versionKey: false, // Disables __v field
  }
);

const ResponseModel = mongoose.model('Response', ResponseSchema);

module.exports = { ResponseModel };
