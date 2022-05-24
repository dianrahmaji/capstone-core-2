import asyncHandler from 'express-async-handler'
import generateToken from '../utils/generateToken.js'
import User from '../models/userModel.js'

// @desc Auth user & get token
// @route POST /api/users/login
// @access Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })

  if (user && user.matchPassword(password)) {
    if (!user.isApproved) {
      res.status(403)
      throw new Error('User not activated')
    }

    res.json({
      _id: user._id,
      accountType: user.accountType,
      email: user.email,
      faculty: user.faculty,
      fullName: user.fullName,
      major: user.major,
      userId: user.userId,
      isAdmin: user.isAdmin,
      isApproved: user.isApproved,
      token: generateToken(user._id)
    })
  } else {
    res.status(401)
    throw new Error('Invalid email or password')
  }
})

// @desc Register a new user
// @route POST /api/users
// @access Public
const registerUser = asyncHandler(async (req, res) => {
  const data = req.body

  const isUserExist = await User.findOne({ email: data.email })

  if (isUserExist) {
    res.status(400)
    throw new Error('User already exists')
  }

  const user = await User.create({ ...data })

  if (user) {
    res.status(201).json({
      _id: user._id,
      accountType: user.accountType,
      email: user.email,
      faculty: user.faculty,
      fullName: user.fullName,
      major: user.major,
      userId: user.userId,
      isAdmin: user.isAdmin,
      isApproved: user.isApproved,
      token: generateToken(user._id)
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})

// @desc GET all users
// @route GET /api/users
// @access Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ isAdmin: false })
  res.json(users)
})

// @desc GET user by id
// @route GET /api/users/:id
// @access Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password')

  if (user) {
    res.status(200).json(user)
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc Approve user
// @route POST /api/users/:id/approve
// @access Private/Admin
const approveUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password')
  const { fullName, email, userId, faculty, major, accountType } = req.body

  if (user) {
    user.fullName = fullName
    user.email = email
    user.userId = userId
    user.faculty = faculty
    user.major = major
    user.accountType = accountType

    const updatedUser = await user.save()
    res.status(200).json(updatedUser)
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc Update user
// @route PUT /api/users/:id
// @access Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password')

  if (user) {
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc Delete user
// @route DELETE /api/users/:id
// @access Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (user) {
    await user.remove()
    res.status(204).json({ message: 'User deleted successfully' })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

export {
  authUser,
  registerUser,
  getUsers,
  getUserById,
  approveUser,
  updateUser,
  deleteUser
}
