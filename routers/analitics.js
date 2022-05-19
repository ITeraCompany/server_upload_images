const exp = require('express')
const controller = require('../controllers/analitics')
const router = exp.Router()
//localhost:5000/api/auth/login
router.get('/overview',controller.overview)
//localhost:5000/api/auth/register
router.get('/analitics',controller.analitics)


module.exports = router