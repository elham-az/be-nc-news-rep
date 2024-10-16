const express = require('express')
const app = express()
const {getAllTopicsController} = require('./controllers/topics-controller')
const {getEndpointsController} = require('./controllers/endpoints-controller')

app.use(express.json())

app.get('/api/topics', getAllTopicsController)

app.get('/api', getEndpointsController)

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