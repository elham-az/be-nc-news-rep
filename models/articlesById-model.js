const db = require('../db/connection')

    const getArticlesbyId = (article_id) => {
        return db.query(`
            SELECT articles.author, articles.title, articles.article_id, articles.body, articles.topic, articles.created_at, articles.votes, articles.article_img_url,
            COUNT(comments.comment_id) AS comment_count
            FROM articles
            LEFT JOIN comments ON articles.article_id = comments.article_id
            WHERE articles.article_id = $1
            GROUP BY articles.article_id
        `, [article_id])
        .then(({ rows }) => {
            console.log(rows)
            console.log(article_id)
            if (rows.length === 0) {
                return Promise.reject({status: 404, msg: 'Article non existent'})
            }
            return rows[0]
        })
    }
    

const updateArticleVotes = (article_id, inc_votes) => {
    return db.query(
        `UPDATE articles
            SET votes = votes + $1
            WHERE article_id = $2
            RETURNING *;`,
        [inc_votes, article_id]
    ).then((result) => {
        return result.rows[0];
    });
};

module.exports = {getArticlesbyId, updateArticleVotes}
