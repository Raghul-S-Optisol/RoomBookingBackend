const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const adminRoutes = require('./Router/adminRouter');
const cors = require('cors')

const app = express();


mongoose.connect('mongodb://127.0.0.1:27017/Roombooking', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB', err);
  });

// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());


app.use('/', adminRoutes);

const port = 8000; 
app.listen(port, () => console.log(`Server running on port ${port}`));

module.exports = app;