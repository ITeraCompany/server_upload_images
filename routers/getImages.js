const express = require('express')
const controller = require('../controllers/position')
const passport = require('passport')
const upload = require('../middelware/upload')
const router = express.Router()

router.get('/', controller.getImages)


module.exports = router