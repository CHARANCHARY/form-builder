const mongoose = require('mongoose');

const formSchema = new mongoose.Schema(
  {
    header: {
      description: { type: String, required: true, minlength: 5 }, // Minimum length validation
      heading: { type: String, required: true, minlength: 3 },
    },
    formId: { type: String, required: true, unique: true }, // Make formId unique
    questions: {
      type: Array,
      required: true,
      validate: {
        validator: (value) => Array.isArray(value) && value.length > 0, // Custom validation
        message: "Questions must be a non-empty array",
      },
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
    versionKey: false, // Disables __v field
  }
);

// Create Index for formId
formSchema.index({ formId: 1 });

const FormModel = mongoose.model('Form', formSchema);

module.exports = { FormModel };
