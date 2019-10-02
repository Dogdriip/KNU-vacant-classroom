let mongoose = require('mongoose');

// Define Schemes
let lectureSchema = new mongoose.Schema({
  code: { type: String },
  title: { type: String },
  instructor: { type: String },
  day: { type: Number },
  hour: { type: Number },
  building: { type: String },
  classroom: { type: String },
});  // 컬렉션 이름 미지정시 모델이름 + s로 자동지정

// Create Model & Export
module.exports = mongoose.model('lecture', lectureSchema);