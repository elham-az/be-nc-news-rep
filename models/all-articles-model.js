const db = require('../db/connection')

const getAllArticles = (sortBy = 'created_at', order = 'desc') => {
    const validColumns = ['author', 'title', 'article_id', 'topic', 'created_at', 'votes', 'comment_count']
    if (!validColumns.includes(sortBy)) {
        return Promise.reject({ status: 400, msg: `Invalid 'sort_by' column. Must be one of: ${validColumns.join(', ')}` })
    }
    if (order !== 'asc' && order !== 'desc') {
        return Promise.reject({ status: 400, msg: "Invalid 'order' value. Must be 'asc' or 'desc'." })
    }

    const query = `
        SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, 
        COUNT(comments.article_id) AS comment_count
        FROM articles
        LEFT JOIN comments ON articles.article_id = comments.article_id
        GROUP BY articles.article_id
        ORDER BY ${sortBy} ${order.toUpperCase()};
    `;
    return db.query(query)
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 404, msg: 'No articles found' })
            }
            return rows
        })
}

module.exports = { getAllArticles }