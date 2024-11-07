const express = require('express')
const app = express()
const { getAllTopicsController } = require('./controllers/topics-controller')
const { getEndpointsController } = require('./controllers/endpoints-controller')
const { getArticlesController,patchArticleById } = require('./controllers/articlesById-controller')
const { getAllArticlesController } = require('./controllers/all-articles-controller')
const { getCommentsController, postCommentController, deleteCommentController } = require('./controllers/commentsByArticleId-controller')
const { getAllUsers } = require('./controllers/users-controller.js')
const cors = require('cors');

app.use(cors());

app.use(express.json())

app.get('/api/topics', getAllTopicsController)

app.get('/api', getEndpointsController)

app.get('/api/articles/:article_id', getArticlesController)

app.get('/api/articles', getAllArticlesController)

app.get('/api/articles/:article_id/comments', getCommentsController)

app.post('/api/articles/:article_id/comments', postCommentController)

app.patch('/api/articles/:article_id', patchArticleById)

app.get('/api/users', getAllUsers)

app.delete('/api/comments/:comment_id', deleteCommentController)

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