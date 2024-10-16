const getEndpoints = require('../models/endpoints-model')

exports.getEndpointsController = (req, res) => {
    getEndpoints()
    .then((endpoints) => {
        // console.log(endpoints)
        res.status(200).send({endpoints})
    })
    .catch(console.log)
}

//module.exports = getEndpointsController

//getEndpointsController()