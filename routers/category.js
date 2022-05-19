const exp = require('express')
const passport = require('passport')
const upload = require('../middelware/upload')

const controller = require('../controllers/category')

const router = exp.Router()

router.get('/',passport.authenticate('jwt',{session:false}),controller.getAll)
router.get('/:id',passport.authenticate('jwt',{session:false}),controller.getById)
router.delete('/:id',passport.authenticate('jwt',{session:false}),controller.delete)
router.post('/',passport.authenticate('jwt',{session:false}),upload.single('image'),controller.create)
router.patch('/:id',passport.authenticate('jwt',{session:false}),upload.single('image'),controller.update)



module.exports = router