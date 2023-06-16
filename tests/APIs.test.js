const request = require('supertest');
const bcrypt = require('bcrypt');
const app = require('../server')
const User = require('../DB/db');



describe('POST /signup', () => {
//   beforeEach(async () => {
//     // Clear the User collection before each test
//     await User.deleteMany({});
//   });

  it('should create a new user when provided with valid data', async () => {
    const newUser = {
      name: 'raghul',
      email: 'raghul@example.com',
      password: 'password123'
    };

    const response = await request(app)
      .post('/signup')
      .send(newUser)
      .expect(201);

    // Verify the response
    expect(response.body).toHaveProperty('_id');
    expect(response.body.name).toBe(newUser.name);
    expect(response.body.email).toBe(newUser.email);

    // Verify that the password is hashed
    const user = await User.findById(response.body._id);
    const isPasswordValid = await bcrypt.compare(newUser.password, user.password);
    expect(isPasswordValid).toBe(true);
  });

  it('should return an error when trying to sign up with an existing email', async () => {
    const existingUser = {
      name: 'Jane Smith',
      email: 'janesmith@example.com',
      password: 'password456'
    };

    // Create an existing user in the database
    await User.create(existingUser);

    const response = await request(app)
      .post('/signup')
      .send(existingUser)
      .expect(401);

    // Verify the response
    expect(response.body).toEqual({ status: 401, Message: 'Existing User' });
  });

//   it('should return an error when encountering an internal server error', async () => {
//     // Simulate an error in the code
//     jest.spyOn(User, 'findOne').mockRejectedValue(new Error('Database connection error'));

//     const newUser = {
//       name: 'raghul',
//       email: 'raghul@example.com',
//       password: 'password123'
//     };

//     const response = await request(app)
//       .post('/signup')
//       .send(newUser)
//       .expect(500);

//     // Verify the response
//     expect(response.body).toEqual({ error: 'Database connection error' });
//   });
});


describe('Signin API', () => {
    // Mock user object
    const user = {
      email: 'raghul@example.com',
      password: 'password123',
    };
  
    // Mock User model with findOne method
    const User = {
      findOne: jest.fn().mockResolvedValue(user),
    };
  
    // Mock bcrypt compare method
    bcrypt.compare = jest.fn().mockResolvedValue(true);
  
    it('should return 200 if login is successful', async () => {
      const response = await request(app)
        .post('/signin')
        .send({ email: user.email, password: user.password })
        .expect(200);
  
      expect(response.body).toEqual({ status: 200, message: 'Login successful' });
    });
  
    it('should return 401 if email is invalid', async () => {
        User.findOne.mockResolvedValueOnce(null);
      
        const response = await request(app)
          .post('/signin')
          .send({ email: 'invalid@example.com', password: user.password })
          .expect(401);
      
          expect(response.body.error).toBe('Invalid email');;
      });
  
    it('should return 401 if password is invalid', async () => {
      bcrypt.compare.mockResolvedValueOnce(false);
  
      const response = await request(app)
        .post('/signin')
        .send({ email: user.email, })
        .expect(401);
  
      expect(response.body).toEqual({ status: 401, error: 'Invalid password' });
    });

  });