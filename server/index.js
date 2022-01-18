const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { pool } = require('./config')
const helmet = require('helmet');
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(helmet())

const getWhitelists = (request, response) => {
    pool.query('SELECT * FROM whitelists', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const addNewWhitelist = (request, response) => {
    const { wallet } = request.body

    pool.query(
        'INSERT INTO whitelists (address) VALUES ($1)',
        [wallet],
        (error) => {
            if (error) {
                throw error
            }
            response.status(201).json({ status: 'success', message: 'Whitelist added.' })
        }
    )
}
const getIdByWallet = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('SELECT * FROM whitelists WHERE address = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}


app.route('/whitelists').get(getWhitelists)
app.route('/whitelists/add').post(addNewWhitelist)
app.route('/whitelists/check/:id').get(getIdByWallet)

// Start server
app.listen(process.env.PORT || 3002, () => {
    console.log(`Server listening`)
})
