const { getCommentsByArticleId, postCommentByArticleId } = require('../models/commentsByArticleId-model')
const { getArticlesbyId } = require('../models/articlesById-model')

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

const postCommentController = (req, res, next) => {
    console.log("Received request for posting comment:", req.body)
    const { article_id } = req.params
    const { username, body } = req.body

    if (!username || !body) {
        return next({ status: 400, msg: 'Missing required fields: username and/or body' })
    }

    postCommentByArticleId(article_id, username, body)
        .then((comment) => {
            res.status(201).send({ comment })
        })
        .catch((err) => {
            next(err);
        })
}

module.exports = { getCommentsController, postCommentController }
