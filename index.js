import express from 'express'
import morgan from 'morgan'
import dotenv from 'dotenv'
import colors from 'colors'

import connectDB from './config/db.js'

dotenv.config()

const PORT = process.env.PORT || 5000

connectDB()

const app = express()

// middlewares
app.use(express.json())
app.use(morgan('dev'))

// routes
app.get('/', (req, res) => {
  res.json({
    message: 'Hi mom!'
  })
})

app.listen(PORT, console.log(`Server is running on port ${PORT}`.yellow.bold))
