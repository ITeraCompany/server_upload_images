const {Position} = require('../models/Model')
const errorHandler = require('../utils/errorHandler')

module.exports.getAll = async function(req, res) {
    try {
        console.log('req.params.category '+req.params.category)
        const positions = await Position.findAll({
            where: {
                category: req.params.category
            },
            order: [
                ['squ', 'ASC']]

        });
        res.status(200).json(positions)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getImages = async function(req, res) {
    try {
        const positions = await Position.findAll({});
        res.status(200).json(positions)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.create = async function(req, res) {
    // try {
        // let imageSrc = req.file ? req.file.path : ''
    // console.log('111111 arr '+String(arr[i].name+'  path '+arr[i].path+'   categoryName '+arr[i].categoryName))

         var arr = JSON.parse(req.body.data);
        //
        for(var i in arr)
        {

            const position = await Position.findOne({ where: {
                category: arr[i].category,
                name: arr[i].name,
                path:arr[i].path
            } });

            if (position === null) {
                // console.log('new pozic '+arr[i].category)
                await Position.create({name:arr[i].name,squ:getFirstPart(arr[i].name),imageSrc:arr[i].imageSrc,
                    path:arr[i].path,category: arr[i].category,categoryName:arr[i].categoryName, user:req.user.id})
                console.log('2222222 arr '+String(arr[i].name+'  path '+arr[i].path+'   categoryName '+arr[i].categoryName))
            } else {
                // await Position.update({name:arr[i].name,squ:arr[i].name,imageSrc:arr[i].imageSrc,category: arr[i].category,user:req.user.id})
                //
                //
                //
                // const updatedRows = await User.update(
                //     {
                //         lastName: "Sebhastian",
                //     },
                //     {
                //         where: { name: arr[i].name}
                //     }
                // );


            }
        }

        res.status(201).json('ok')

    // }catch (e) {
    //     errorHandler(res,e)
    // }

}

// module.exports.create = async function (req,res) {
//
//     try {
//         // let {name,squ} = req.body
//         let imageSrc = req.file ? req.file.path : ''
//         const category = await Category.create({name:req.body.name,squ:req.body.name,imageSrc,user:req.user.id})
//
//         res.status(201).json(category)
//
//     }catch (e) {
//         errorHandler(res,e)
//     }
//
// }

function getFirstPart (str) {
    let index = str.lastIndexOf('.');
    return str.substring(0,index);
}

module.exports.update = async function(req, res) {

    try {
        let imageSrc = req.file ? req.file.path : ''
        await Position.update({name:req.body.name,squ:req.body.name,imageSrc: imageSrc},{where: {id: req.params.id}});


        const position = await Position.findByPk(req.params.id);
        console.log(position)
        res.status(200).json(position)


    } catch (e) {
        errorHandler(res, e)
    }


}
module.exports.delete = async function(req, res) {

    try {
        await Position.destroy({
            where: {
                id: req.params.id
            }
        });
        res.status(200).json({message: 'Позиция удалена'})
    } catch (e) {
        errorHandler(res, e)
    }

}

module.exports.remove = async function(req, res) {

    try {
        await Position.destroy({
            where: {
                category: req.params.id
            }
        });
        res.status(200).json({message: 'Позиция удалена'})
    } catch (e) {
        errorHandler(res, e)
    }

}





