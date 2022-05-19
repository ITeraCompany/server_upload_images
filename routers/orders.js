const exp = require('express')
const controller = require('../controllers/orders')
const router = exp.Router()

router.get('/',controller.getAll)
router.post('/',controller.create)

module.exports = router