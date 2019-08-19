const multer = require('multer');

const upload = multer({
  limits: {
    fileSize: 2000000
  },
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(jpeg|jpg|png)$/i))
      return cb(new Error('Please upload a valid jpeg or png file'));
    cb(undefined, true);
  }
});

module.exports = {
  upload
};
