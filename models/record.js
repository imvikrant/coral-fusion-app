const mongoose = require('mongoose');

const recordSchema = mongoose.Schema({
  rollNo: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  imageUpload: {
    type: Buffer
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Record', recordSchema, 'records');
