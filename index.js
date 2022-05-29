
const sequelize = require('./db');
const models = require('./models/Model');
const port = process.env.PORT || 5000

const start = async () => {
     try {
        await sequelize.authenticate();
        // await sequelize.sync({ force: true });
        //   await sequelize.sync({ alter: true });
         await sequelize.sync();

        app.listen(port,'localhost',() => console.log(`server is starting on ${port}`))

     } catch (e) {
         console.log(e);
     }
}

start();

const app = require('./app')
