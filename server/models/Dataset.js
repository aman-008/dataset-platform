const mongoose = require("mongoose");

const datasetSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  tags: [String],
  fileUrl: {
    type: String,
    required: true
  },
  fileType: String,
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  downloads: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model("Dataset", datasetSchema);