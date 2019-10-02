let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

// 여기서 스키마 직접 정의 후 mongoose.model()도 가능
let Lecture = require('../models/lecture');


router.get('/', (req, res, next) => {
  res.render('index');
});

router.post('/', (req, res, next) => {
  // unpack req.body
  let building = req.body.building;
  let classroom = req.body.classroom;
  let day = req.body.day;
  let hour = req.body.hour;

  console.log(`received: ${building} ${classroom} ${day} ${hour}`);

  Lecture.findOne({ 'building': building, 'classroom': classroom,  /*'hour': hour*/ }, (err, lecture) => {
    if (err) { res.status(500).send(err); }

    console.log('db result: ' + lecture);
    if (!lecture) {  // find 쓸 땐 인자 받아오는게 {}니까 lecture.length === 0
      // 빔
      console.log(0);
      res.send({'status': 0});
    } else {
      // 안빔
      console.log(1);
      res.send({'status': 1, 'title': lecture['title'], 'instructor': lecture['instructor'], });
    }
  });
});

module.exports = router;
