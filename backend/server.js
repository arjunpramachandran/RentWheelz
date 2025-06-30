const express = require('express')
const cookieParser = require('cookie-parser')
const app = express()
const cors = require('cors')

const connectDB = require('./config/db')
require('dotenv').config()
const port = process.env.PORT

const adminRouter = require('./routes/adminRoutes')
const hostRouter = require('./routes/hostRoutes')
const customerRouter = require('./routes/customerRoutes')

app.get('/',(req,res)=>{
  res.send('Hello World')
})
app.use(cookieParser())
app.use(express.json())

app.use('/uploads', express.static('uploads'));
const clientURL = process.env.CLIENT_URL 
app.use(cors({
  origin: clientURL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT','PATCH', 'DELETE'],
}))

app.use('/api/user',customerRouter)
app.use('/api/host',hostRouter)
app.use('/api/admin',adminRouter)


connectDB()
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})