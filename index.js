import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'
import colors from 'colors'

import connectDB from './config/db.js'
import { notFound, errorHandler } from './middlewares/errorMiddleware.js'

import userRoute from './routes/userRoute.js'
import adminRoute from './routes/adminRoute.js'
import teamRoute from './routes/teamRoute.js'

dotenv.config()

const PORT = process.env.PORT || 5000

connectDB()

const app = express()

// middlewares
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

// routes
app.get('/', (req, res) => {
  res.json({
    message: 'Hi mom!'
  })
})

app.use('/api/users', userRoute)
app.use('/api/admin', adminRoute)
app.use('/api/team', teamRoute)

app.use(notFound)
app.use(errorHandler)

app.listen(PORT, console.log(`Server is running on port ${PORT}`.yellow.bold))
