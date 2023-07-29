const authService = require('../services/authService');

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;


    const existingUser = await authService.findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists with this email' });
    }

    const newUser = await authService.createUser(username, email, password);
    if (!newUser) {
      return res.status(500).json({ error: 'Failed to create user' });
    }

    return res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (err) {
    console.error('Error in registerUser:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;


    const user = await authService.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isPasswordValid = await authService.comparePasswords(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = authService.generateAuthToken(user);

    return res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    console.error('Error in loginUser:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { registerUser, loginUser };
