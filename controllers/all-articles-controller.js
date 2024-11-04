const { getAllArticles } = require('../models/all-articles-model');

// const getAllArticlesController = (req, res, next) => {
//     const { sort_by, order } = req.query

//     getAllArticles(sort_by, order)
//         .then((articles) => {
//             res.status(200).send({ articles })
//         })
//         .catch((err) => {
//             next(err)
//         })
// }

// module.exports = { getAllArticlesController }

const getAllArticlesController = (req, res, next) => {
    const { sort_by, order, topic } = req.query
    getAllArticles(sort_by, order)
        .then((articles) => {
            let filteredArticles = articles
            if (topic) {
                filteredArticles = articles.filter(article => article.topic === topic)
                if (filteredArticles.length === 0) {
                    return res.status(404).json({ error: "No articles found for the specified topic." })
                }
            }
            res.status(200).json({ articles: filteredArticles })
        })
        .catch((error) => {
            console.error("Error fetching articles:", error)
            next(error)
        })
}

module.exports = { getAllArticlesController }