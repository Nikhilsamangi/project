const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const Expense = require('../models/addExpenses'); // 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



// @desc Register user
// @route POST /api/users/register
// @access Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, mobile, company, username, email, password, role } = req.body;

  if (!name || !mobile || !company || !username || !email || !password || !role) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }

  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await User.create({
      name,
      mobile,
      company,
      username,
      email,
      password: hashedPassword,
      role
    });

    res.status(201).json({ _id: user.id, email: user.email , username:user.username});
  } catch (error) {
    console.error(error.message || error);
    res.status(500).send("Server Error");
  }
});

// @desc Login user
// @route POST /api/users/login
// @access Public
const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400);
    throw new Error('All fields are mandatory');
  }

  const user = await User.findOne({ username });

  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
         
          
          id: user._id,
          role: user.role
        
      },
      process.env.ACCESS_TOKEN_SECRET_KEY,
      { expiresIn: '356d' }
    );
    res.status(200).json( {accessToken} );
  } else {
    res.status(401);
    throw new Error('Invalid username or password');
  }
});

// @desc Get current user
// @route GET /api/users/current
// @access Private
const currentUser = asyncHandler(async (req, res) => {
  res.json(req.user);
});


// @desc Add a new expense
// @route POST /api/expenses
// @access Private
const addExpenses = asyncHandler(async (req, res) => {
  const { userId, date, amount, payee, description, category } = req.body;
  const receipt = req.file ? req.file.path : null; // Get the file path

  // Validate required fields
  if (!userId || !date || !amount || !payee || !description || !category) {
    res.status(400);
    throw new Error('All fields are mandatory');
  }

  // Check if userId exists in the User collection
  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Get the username of the user
  const addedBy = user.name; // Assuming the username field exists in the User model

  // Create a new expense document
  try {
    const expense = await Expense.create({
      userId,
      date,
      amount,
      payee,
      description,
      category,
      receipt,
      added_by: addedBy // Include the username
    });

    // Send a success response with the created expense data
    res.status(201).json(expense);
  } catch (error) {
    console.error(error.message || error);
    res.status(500).send('Server Error');
  }
});


const allEmployee=async(req, res)=>{
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error(error.message || error);
    res.status(500).send("Server Error");
  }
 }
 const updateRole = async (req, res) => {
  try {
    const { role } = req.body;
    const userId = req.params.id;
    const currentUserId = req.user.id; // Assuming you are using some authentication middleware to get the current user's ID
    const currentUserRole = req.user.role; // Assuming the role of the current user is also included

    // Check if the role is provided
    if (!role) {
      return res.status(400).json({ message: 'Role is required' });
    }

    // Check if the current user is an admin
    if (currentUserRole !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized: Only admin can update roles' });
    }

    // Find and update the user
    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User role updated successfully', user });
  } catch (error) {
    console.error(error.message || error);
    res.status(500).send('Server Error');
  }
};

const getUser = async (req, res) => {
  try {
    const userId = req.params.id;
    // userId: req.user.id
    // Validate the user ID format if necessary
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Find the user by ID
    const user = await User.findById(userId).exec();

    // Check if the user was found
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the user details
    res.json(user);
  } catch (error) {
    console.error(error.message || error);
    res.status(500).send('Server Error');
  }
};
module.exports = { registerUser, loginUser, currentUser , addExpenses,allEmployee,updateRole,getUser};
