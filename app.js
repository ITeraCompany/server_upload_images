const exp = require('express')
const bodyParser = require('body-parser')
const passport = require('passport')
const path = require('path')
const authRouters = require('./routers/auth')
const analiticsRouters = require('./routers/analitics')
const categoryRouters = require('./routers/category')
const orderRouters = require('./routers/orders')
const positionsRouters = require('./routers/positions')
const getImages = require('./routers/getImages')
const app = exp();

app.use(passport.initialize())
const f = require('./middelware/passport')
f(passport);
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(require('morgan')('dev'))
app.use('/uploads',exp.static('uploads'))
app.use(require('cors')())
app.use('/api/auth/',authRouters)
app.use('/api/analitics/',analiticsRouters)
app.use('/api/category/',categoryRouters)
app.use('/api/order/',orderRouters)
app.use('/api/position/',positionsRouters)

app.use('/api/getImages/',getImages)


if (process.env.NODE_ENV === 'production') {
    app.use(exp.static('client/dist/client'))

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'dist', 'client', 'index.html'))
    })
}


module.exports = app;