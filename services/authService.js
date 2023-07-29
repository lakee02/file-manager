const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const registerUser = async (userData) => {
  try {
    const { username, email, password } = userData;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return newUser;
  } catch (err) {
    throw new Error(err.message);
  }
};

const loginUser = async (email, password) => {
  try {
    
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Invalid email or password');
    }

    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    
    const token = generateAuthToken(user);

    return token;
  } catch (err) {
    throw new Error(err.message);
  }
};

const generateAuthToken = (user) => {
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: '1h', 
  });
  return token;
};

module.exports = { registerUser, loginUser };
