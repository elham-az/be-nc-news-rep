const db = require('../db/connection')

const getAllTopics = () => {
    return db.query('SELECT * FROM topics;').then((result) => {
        return result.rows
    })
}

module.exports = { getAllTopics }