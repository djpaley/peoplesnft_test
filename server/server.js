const Pool = require('pg').Pool
const pool = new Pool({
    user: 'db',
    host: 'app-fc672b5c-ef45-43fe-b0e6-c7c20bf13511-do-user-10586673-0.b.db.ondigitalocean.com',
    database: 'db',
    password: 'CHT2gBKdRS6Y2ysP',
    port: 25060,
});

const getWhitelists = () => {
    return new Promise(function(resolve, reject) {
        pool.query('SELECT * FROM whitelists_test ORDER BY id ASC', (error, results) => {
            if (error) {
                reject(error)
            }
            resolve(results.rows);
        })
    })
}
const getWhitelistByWallet = (walletID) => {
    return new Promise(function(resolve, reject) {
        const wallet = parseInt(walletID)
        pool.query('SELECT * FROM whitelists_test WHERE address == $1', [wallet], (error, results) => {
            if (error) {
                reject(error)
            }
            resolve(results.rows);
        })
    })
}
const createWhitelist = (body) => {
    return new Promise(function(resolve, reject) {
        const { address } = body
        pool.query('INSERT INTO whitelists_test (address) VALUES ($1) RETURNING *', [address], (error, results) => {
            if (error) {
                reject(error)
            }
            resolve(`A new whitelist has been added added: ${results.rows[0]}`)
        })
    })
}
const deleteWhitelist = (whitelistId) => {
    return new Promise(function(resolve, reject) {
        const id = parseInt(whitelistId)
        pool.query('DELETE FROM whitelists_test WHERE id = $1', [id], (error, results) => {
            if (error) {
                reject(error)
            }
            resolve(`Whitelist deleted with ID: ${id}`)
        })
    })
}

module.exports = {
    getWhitelists,
    getWhitelistByWallet,
    createWhitelist,
    deleteWhitelist,
}
