const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const sharp = require('sharp');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const { upload } = require('./middlewares/image_upload');

// Initialize Mongoose Models
require('./models/user');
require('./models/record');

// Connect to MongoDB Database
mongoose.connect(
  'mongodb+srv://coral-fusion:1Lzi11aeHdhrg2w7@cluster0-vrgjy.mongodb.net/student-records?retryWrites=true&w=majority',
  { useNewUrlParser: true }
);

const app = express();

app.use(express.static(path.join(__dirname, 'dist', 'coral-fusion-app')));

// Inititialize required middlewares
app.use(
  cors({
    credentials: true
  })
);
app.use(
  expressJwt({ secret: 'coral-fusion' }).unless({
    path: ['/login', '/register', '/', /^\/avatar\/.*/]
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Retrieve Models
const User = mongoose.model('User');
const Record = mongoose.model('Record');

// LOGIN
// Send authorization token to the client after succesful authentication
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && user.password === password) {
    var token = jwt.sign({ userId: user.id }, 'coral-fusion', {
      expiresIn: '12h'
    });
    res.status(200).json({
      token
    });
  } else {
    res.json({
      error: 'Invalid user name or password'
    });
  }
});

// REGISTER
// Create a new account with the credentials provided by the user
app.post('/register', async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  if (password === confirmPassword) {
    const user = new User({ email, password });
    await user.save();

    var token = jwt.sign({ userId: user.id }, 'coral-fusion', {
      expiresIn: '12h'
    });

    res.status(200).json({
      token
    });
  } else {
    res.json({ error: 'passwords do not match' });
  }
});

// POST RECORD
// Allow user to upload a record if authorization token is valid
app.post('/record', upload.single('image'), async (req, res) => {
  const { rollNo, name, subject } = req.body;

  const buffer = await sharp(req.file.buffer)
    .resize(250)
    .png()
    .toBuffer();

  const user = await User.findById(req.user.userId);

  if (user) {
    const record = new Record({
      rollNo,
      name,
      subject,
      imageUpload: buffer,
      createdBy: user.id
    });
    await record.save();
    res.status(200).json({ record });
  } else {
    res.send({
      error: 'No User found'
    });
  }
});

// GET RECORDS
// Retrieve all records belonging to the user
app.get('/records', async (req, res) => {
  const records = await Record.find({
    createdBy: new mongoose.Types.ObjectId(req.user.userId)
  });

  res.send({ records });
});

// GET AVATAR
// Retrive the uploaded imaged for given record given by the record id
app.get('/avatar/:id', async (req, res) => {
  const id = req.params.id;

  const record = await Record.findById(id);

  if (record && record.imageUpload) res.send(record.imageUpload);
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log('server is running on port ' + port);
});
