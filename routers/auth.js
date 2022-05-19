const exp = require('express')
const controller = require('../controllers/auth')
const router = exp.Router()
//localhost:5000/api/auth/login
router.post('/login',controller.login)
//localhost:5000/api/auth/register
router.post('/register',controller.register)


module.exports = router