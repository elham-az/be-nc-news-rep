const { getAllArticles } = require('../models/all-articles-model')

const getAllArticlesController = (req, res, next) => {
    getAllArticles()
        .then((articles) => {
            console.log(articles)
            res.status(200).send({articles})
        })
        .catch((err) => {
            next(err)
        })
}

module.exports = { getAllArticlesController }