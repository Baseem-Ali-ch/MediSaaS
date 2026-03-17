import express from 'express'
import cors from 'cors'
import indexRoutes from './routes/index'
import { errorHandler } from './middlewares/error-handler'

const app = express()

app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true, 
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true })) 

app.use('/api', indexRoutes)

app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' })
})

app.use(errorHandler);
export default app
