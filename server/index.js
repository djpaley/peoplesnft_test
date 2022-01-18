const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { pool } = require('./config')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

const getWhitelists = (request, response) => {
    pool.query('SELECT * FROM books', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const addNewWhitelist = (request, response) => {
    const { author, title } = request.body

    pool.query(
        'INSERT INTO books (author, title) VALUES ($1, $2)',
        [author, title],
        (error) => {
            if (error) {
                throw error
            }
            response.status(201).json({ status: 'success', message: 'Book added.' })
        }
    )
}
const getIdByWallet = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('SELECT * FROM books WHERE author = $1', [id], (error, results) => {
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
