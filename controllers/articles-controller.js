const { getArticlesbyId } = require('../models/articles-model')

const getArticlesController = (req, res, next) => {
    const { article_id } = req.params
    console.log(article_id)
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

module.exports = { getArticlesController }