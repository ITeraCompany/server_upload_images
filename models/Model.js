const  sequelize = require('../db');
const {DataTypes} = require('sequelize')

const Authorization= sequelize.define('Authorization',{
    id: {type: DataTypes.INTEGER,primaryKey:true,autoIncrement:true},
    token:{type: DataTypes.STRING,unique:true,allowNull:false},
    partnerWarehouseId:{type: DataTypes.STRING,allowNull:false},
    name : {type: DataTypes.STRING,allowNull:false}

})

const User = sequelize.define('users',{
    id: {type: DataTypes.INTEGER,primaryKey:true,autoIncrement:true},
    email:{type: DataTypes.STRING,unique:true,allowNull:false},
    password:{type: DataTypes.STRING,allowNull:false},
    name : {type: DataTypes.STRING,allowNull:false}

})

const Category = sequelize.define('category',{
    id: {type: DataTypes.INTEGER,primaryKey:true,autoIncrement:true},
    name:{type: DataTypes.STRING,unique:false,allowNull:false},
    squ:{type: DataTypes.STRING,allowNull:false},
    imageSrc:{type: DataTypes.STRING,defaultValue:"",allowNull:true},
    user : {type: DataTypes.STRING,allowNull:false}
})

const Position = sequelize.define('positions',{
    id: {type: DataTypes.INTEGER,primaryKey:true,autoIncrement:true},
    name:{type: DataTypes.STRING,unique:true,allowNull:false},
    squ:{type: DataTypes.STRING,allowNull:false},
    imageSrc:{type: DataTypes.STRING,defaultValue:"",allowNull:true},
    category:{type: DataTypes.STRING,allowNull:false},
    user:{type: DataTypes.STRING,allowNull:false}
})

module.exports = {
    Authorization,
    User,
    Category,
    Position
}











