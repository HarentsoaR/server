//require('dotenv').config({ path: './Config/.env' })
// const {pool} = require('./config/db')

const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const http = require('http')
const { requireAuth} = require('./middlewares/Auth.middelware')
const app = express()
const server = http.createServer(app)
const corsOptions = {
    origin: ['http://localhost:7000', 'http://10.128.1.245:7000'],
    credentials: true,
    'allowedHeaders': ['sessionId', 'Content-Type'],
    'exposedHeaders': ['sessionId'],
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'preflightContinue': false,
}
 


app.use(cors(corsOptions));
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())

app.use('/',require('./routes/departement.routes'))
app.use('/',require('./routes/equipe.routes'))
app.use('/api/v1/user', require('./routes/user.routes'))
app.get('/api/v1/jwt', requireAuth)

server.listen(8088, () => {
    console.log(`Listening on port 8088`)
})