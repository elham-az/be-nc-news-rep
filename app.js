const express = require('express')
const app = express()
const {getAllTopicsController} = require('./controllers/topics-controller')

app.use(express.json())
app.get('/api/topics', getAllTopicsController)

module.exports = app