const { getCommentsByArticleId } = require('../models/article-comments-model')
const { getArticlesbyId } = require('../models/articles-model')

const getCommentsController = (req, res, next) => {
    const {article_id} = req.params
    // if (isNaN(Number(article_id))) {
    //     return next({ status: 400, msg: 'Invalid article ID' })
    // }
    getArticlesbyId(article_id)
        .then(() => getCommentsByArticleId(article_id))
        .then((comments) => {
            res.status(200).send({comments})
        })
        .catch((err) => {
            next(err)
        })
}

module.exports = { getCommentsController }