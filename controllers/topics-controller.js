const { getAllTopics } = require('../models/topics-model')

exports.getAllTopicsController = (req, res) => {
    getAllTopics()
        .then((topics) => {
            console.log(topics)
            res.status(200).send({topics})
        })
        .catch(console.log)
}