const express = require('express')
const app = express()
const {getAllTopicsController} = require('./controllers/topics-controller')
const {getEndpointsController} = require('./controllers/endpoints-controller')
const {getArticlesController} = require('./controllers/articles-controller')
const { getAllArticlesController } = require('./controllers/all-articles-controller')

app.use(express.json())

app.get('/api/topics', getAllTopicsController)

app.get('/api', getEndpointsController)

app.get('/api/articles/:article_id', getArticlesController)

app.get('/api/articles', getAllArticlesController)

app.use((err, req, res, next) => {
    if (err.status) {
        res.status(err.status).send({ msg: err.msg })
    } else if (err.code === '22P02') {
        res.status(400).send({ msg: 'Invalid input' })
    }  else {
        res.status(500).send({ msg: 'Internal Server Error' })
    }
})

module.exports = app