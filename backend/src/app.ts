import express from 'express'
import cors from 'cors'

const app = express()

app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS' ],
}))
app.use(express.json())


export default app
