const { getArticlesbyId, updateArticleVotes } = require('../models/articlesById-model')

const getArticlesController = (req, res, next) => {
    const { article_id } = req.params
    //console.log(article_id)
    // if (isNaN(Number(article_id))) {
    //     return res.status(400).send({msg: 'Invalid article id'})
    // }
    getArticlesbyId(article_id).then((article)=> {
        
        res.status(200).send({article})
    })
    .catch((err) => {
        next(err)
    })
}

const patchArticleById = (req, res, next) => {
    const { article_id } = req.params
    const { inc_votes } = req.body
    if (inc_votes === undefined) {
        return res.status(400).send({ msg: "Missing required field: inc_votes" })
    }
    updateArticleVotes(article_id, inc_votes)
        .then((updatedArticle) => {
            if (!updatedArticle) {
                res.status(404).send({ msg: "Article not found" })
            } else {
                res.status(200).send({ article: updatedArticle })
            }
        })
        .catch((err) => {
            if (err.code === '22P02') {
                res.status(400).send({ msg: "Invalid article_id format" })
            } else {
                next(err)
            }
        })
}

module.exports = { getArticlesController, patchArticleById }