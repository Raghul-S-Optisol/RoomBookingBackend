const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }
  });

const locationSchema = new mongoose.Schema({
    location: { type: String, required: true },
    count: { type: Number, required: true },
  });

  const deleteSchema = new mongoose.Schema({
    location: { type: String, required: true },
  });

  const roomsSchema = new mongoose.Schema({
    location: { type: String },
    room:{type:Number},
    status:{type:Number},
    mobile:{type:Number},
    start:{type:Date},
    end:{type:Date},

  });

  const User = mongoose.model('User', userSchema,'customers');
  const Location = mongoose.model('Location',locationSchema,'locations');
  const Del = mongoose.model('Del', deleteSchema,'locations');
  const Rooms = mongoose.model('Rooms', roomsSchema,'rooms');
  
  module.exports = {User, Location, Del, Rooms };

  