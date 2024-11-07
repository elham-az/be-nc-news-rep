const db = require('../db/connection')

const getCommentsByArticleId = (article_id) => {
    return db.query(
        `SELECT comment_id, votes, created_at, author, body, article_id, article_id 
        FROM comments 
        WHERE article_id = $1 
        ORDER BY created_at DESC;`,
        [article_id]
    )
    .then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({status: 200, msg: 'No comments found for this article'})
        }
        return rows
    })
}

const postCommentByArticleId = (article_id, username, body) => {
    return db.query(
        `INSERT INTO comments (article_id, author, body)
         VALUES ($1, $2, $3)
         RETURNING *;`,
        [article_id, username, body]
    )
    .then(({ rows }) => {
        return rows[0]
    })
    .catch((err) => {
        if (err.code === '23503') {
            return Promise.reject({ status: 404, msg: 'Article or user not found' })
        }
        throw err
    })
}


const deleteCommentById = (comment_id) => {
    return db.query(
        `DELETE FROM comments WHERE comment_id = $1 RETURNING *;`,
        [comment_id]
    ).then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({ status: 404, msg: 'Comment not found' })
        }
    })
}

module.exports = { getCommentsByArticleId, postCommentByArticleId, deleteCommentById }

