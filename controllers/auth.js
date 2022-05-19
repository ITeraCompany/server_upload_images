const Bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const ApiError = require('../error/ApiError')
const {User} = require('../models/Model')
const Keys = require('../config/keys')
const errorHandler = require('../utils/errorHandler')

module.exports.login = async function (req,res,next) {

    const {email,password,name} = req.body
    const candidate = await User.findOne(
        {
            where: {email,email}
        }
    )
    if(candidate)
    {
        const passwordResult = Bcrypt.compareSync(password,candidate.password)

        if (passwordResult){

            const token = jwt.sign({
                email:candidate.email,
                userId:candidate.id,

            },Keys.jwt,{expiresIn: 2*(60*60)})

            res.status(200).json(
                {token: `Bearer ${token}`})

        }else
        {
            res.status(401).json({message: 'Пароль неверный'})
        }

    }else{

        res.status(404).json({message: 'Пользователь не найден'})

    }


}



module.exports.register = async function (req,res,next) {

    const {email,password} = req.body
    const name = email

    if(!email || !password)
    {
        res.status(409).json({message: 'не корректный имя или email или password'})
    }
    const candidate = await User.findOne({where:{email}})
    if (candidate){
        res.status(409).json({message: 'Такой email уже занят'})
    }

    const salt = Bcrypt.genSaltSync(10);
    const hash = Bcrypt.hashSync(password, salt);

    try {
        const user = await User.create({email,password:hash,name})
    }catch (e) {

        errorHandler(res,e)
    }


    return res.json(email)

}