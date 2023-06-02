const express = require('express')
const router = express.Router()
const authorController = require('../controllers/authorController')

router.get('/', authorController.getAllAuthors)
    .post('/', authorController.addNewAuthor)

router.get('/:authorId', authorController.getAuthor)

module.exports = router