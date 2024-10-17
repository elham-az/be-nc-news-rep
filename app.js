const express = require('express')
const app = express()
const {getAllTopicsController} = require('./controllers/topics-controller')
const {getEndpointsController} = require('./controllers/endpoints-controller')
const {getArticlesController} = require('./controllers/articles-controller')

app.use(express.json())

app.get('/api/topics', getAllTopicsController)

app.get('/api', getEndpointsController)

app.get('/api/articles/:article_id', getArticlesController)

app.use((err, req, res, next) => {
    if (err.status) {
        res.status(err.status).send({ msg: err.msg })
    } else {
        res.status(500).send({ msg: 'Internal Server Error' })
    }
})

// app.get('/api', (req, res) => {
//   const filePath = `${__dirname}/endpoints.json`
//   return fs.readFile(filePath, 'utf8', (err, data) => {
//     if (err){
//         console.log(err)
//         return err
//     }
//     else {return JSON.parse(data)}
// })//.then((result) => res.status(200).send(result.topics))
//})

module.exports = app