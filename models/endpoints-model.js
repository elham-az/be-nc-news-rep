const fs = require('fs').promises

const getEndpoints = () => {
    return fs.readFile(`${__dirname}/../endpoints.json`, "utf8")
    .then((data) => {
        // console.log(JSON.parse(data))
        return JSON.parse(data)
    })
    .catch((err) => {
        return err
    })
}

module.exports = getEndpoints
//getEndpoints()
