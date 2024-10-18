const db = require('../db/connection')

const getArticlesbyId = (article_id) => {
    return db.query (`SELECT author, title, article_id, body, topic, created_at, votes, article_img_url
    FROM articles
    WHERE article_id = $1
    `, [article_id])
    .then(({ rows }) => {
        //console.log(rows)
        //console.log(article_id)
        if (rows.length===0) {
            return Promise.reject({status:404, msg: 'Article non existent'})
        }
        return rows[0]})
    }

module.exports = {getArticlesbyId}
