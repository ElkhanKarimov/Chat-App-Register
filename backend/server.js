import express from 'express'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import "dotenv/config"
import authRoute from './routes/auth.route.js'

const app = express()
app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', authRoute)

const PORT = process.env.PORT || 8000
const MONGODB_URL = process.env.MONGODB_URL



mongoose.connect(MONGODB_URL)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Database connected and server listening on ${PORT}`);
        });
    })
    .catch((error)=>{
        console.log(`Mongodb Connect error: ${error} `);
    })