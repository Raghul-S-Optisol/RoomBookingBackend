const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const {User,Location,Del,Rooms} = require('../DB/db')

const currentDate = new Date();

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await User.findOne({ email });
     if (existingUser) {
       res.status(401).json({ status: 401, Message: 'Existing User' });
     } else {
        const user = new User({ name, email, password: hashedPassword,});
        await user.save();
        res.status(201).json(user);
     }
  } catch (err) {  
    res.status(500).json({ error: err.message });
  }
});

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: 'Invalid email' });
      }

      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (isPasswordMatch) {
        return res.status(200).json({status: 200, message: 'Login successful' });
      }
      // Passwords don't match, return an error
      return res.status(401).json({status: 401, error: 'Invalid password' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Server error' });
    }
});

router.post('/addLocation', (req, res) => {
    const { location, count } = req.body;
    const status =1,mobile=0,start=currentDate,end=currentDate;
    let room = 0;
    const loc = new Location({ location, count });
    loc.save()
    .then(() => {
      for (let i = 1; i <= count; i++) {
         room = i;
        const roomLoc = new Rooms({ location, room, status, mobile, start, end });
        roomLoc.save();
      }
    })
    .then(() => {
      res.status(201).json(loc);
    })
    .catch((error) => {
      res.status(500).send(error);
    });  
});

router.get('/showLocation', async (req, res) => {
  try {
    // Use the find method to retrieve all documents
    const loct = await Location.find({});
    res.status(200).json(loct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}); 

router.get('/showRooms', async (req, res) => {
  const location = req.query.location;
  try {
    // Use the find method to retrieve all documents
    const loct = await Rooms.find({location:location});
    res.status(200).json(loct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/deleteLocation',  async(req, res) => {
    const {location} = req.body;
    try {
        const deleteLocation = await Del.findOneAndDelete({ location: location });
        if (!deleteLocation) {
          return res.status(404).send('Location not found');
        }

        try {
            const deletedDocuments = await Rooms.deleteMany({ location: location });
            if (deletedDocuments.deletedCount === 0) {
              return res.status(404).send('No documents found');
            }
            return res.status(200).send('Location deleted successfully');
          } catch (error) {
            console.error(error);
            return res.status(500).send('Server error');
          } 
      } catch (error) {
        console.error(error);
        return res.status(500).send('Server error');
      }
    
  });

  router.put('/updateLocation', async (req, res) => {
    const { location,count } = req.body;
    const status =1,mobile=0,start=currentDate,end=currentDate;
    let room = 0; 
    try {
     
      const val = await Location.findOne({ location: location });
      if (val) {
        val.count+=count; 
        await val.save(); 
        res.status(200).json(val);
      } else {
        console.log('No matching person found.');
        res.status(404).json({ error: 'No matching person found' });
      }
      let max = 0;
      const result = await Rooms.find({ location: location }).sort({ room: -1 }).limit(1).exec();
      if (result.length > 0) {
         max = result[0].room;
      } else {
        res.status(404).json({ error: 'No rooms found' }); // Send a response indicating no rooms found
      }
  console.log(max);
    for (let i = 1; i <= count; i++) {
      room = max+i;
      const roomLoc = new Rooms({ location, room, status, mobile, start, end });
      roomLoc.save();
    }

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' }); // Send a response for internal server error
    }
});



router.delete('/deleteRoom', async (req, res) => {
  const { room, location } = req.body;

  try {
    // Delete user with given room and name
    const deletedUser = await Rooms.findOneAndDelete({ room, location });

    if (deletedUser) {
      // Decrement count by 1 in location collection
      await Location.findOneAndUpdate(
        { location }, // Match the name field
        { $inc: { count: -1 } } // Decrement the count field by 1
      );

      res.status(200).json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



  


module.exports = router;                          