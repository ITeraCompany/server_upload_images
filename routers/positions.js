const express = require('express')
const controller = require('../controllers/position')
const passport = require('passport')
const upload = require('../middelware/upload')
const router = express.Router()

router.get('/:category', passport.authenticate('jwt', {session: false}), controller.getAll)
router.post('/', passport.authenticate('jwt', {session: false}), upload.array("uploads[]", 250), controller.create)
router.patch('/:id', passport.authenticate('jwt', {session: false}), upload.array("uploads[]", 250),controller.update)
router.delete('/:id', passport.authenticate('jwt', {session: false}), controller.delete)

module.exports = router