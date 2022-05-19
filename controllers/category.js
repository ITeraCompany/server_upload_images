const {Category,Position} = require('../models/Model')
const errorHandler = require('../utils/errorHandler')

module.exports.getAll = async function(req, res) {
    try {
        const categories = await Category.findAll();
        res.status(200).json(categories)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getById = async function (req,res) {

    try {
        const category  = await Category.findByPk(req.params.id)
        res.status(200).json(category)

    }catch (e) {
        errorHandler(res,e)
    }

}


module.exports.create = async function (req,res) {

     // try {
        // let {name,squ} = req.body
        //let imageSrc = req.file ? req.file.path : ''
        // let imageSrc = ''

       // console.log(' module.exports.create '+req.body.name)

       var arr = JSON.parse(req.body.name);
       let categoryes = []

    for(var i in arr) {

           const category = await Category.findOrCreate({
                where: { name: arr[i] },
                defaults: {
                    squ: arr[i],
                    imageSrc:'',
                    user: req.user.id
                }
            });

        categoryes.push(category)
    }

    res.status(201).json(categoryes)

    // await Category.findOrCreate({ where: { name: arr[i] }})

        // var arr = JSON.parse(req.body.name);
        //
        // for(var i in arr) {
        //     // await Category.findOrCreate({ where: { name: arr[i] }})
        //
        //     console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!new cat '+arr[i] )
        //
        //     // await Category.create({name: arr[i], squ: arr[i], imageSrc, user: req.user.id})
        //
        // }






    // }catch (e) {
    //     console.log('error module.exports.create '+req.body.name)
    //     errorHandler(res,e)
    // }

}

module.exports.update = async function (req,res) {

    try {
        let imageSrc = req.file ? req.file.path : ''
        const updatedRows = await Category.update({imageSrc: imageSrc},{where: {id: req.params.id}});
        res.status(200).json(updatedRows)
    } catch (e) {
        errorHandler(res, e)
    }

}


module.exports.remove = async function (req,res) {

    try {
        await Category.destroy({
            where: {
                id: req.params.id
            }
        });
        res.status(200).json({message: 'Удалено'})
    } catch (e) {
        errorHandler(res, e)
    }

}

module.exports.delete = async function (req,res) {

    // try {
        await Category.destroy({
            where: {
                id: req.params.id
            }
        });

        await Position.destroy({
            where: {
                category: req.params.id
            }
        });

        res.status(200).json({message: 'Удалено'})
    // } catch (e) {
    //     errorHandler(res, e)
    // }



}



