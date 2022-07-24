const Sequelize=require('sequelize');

const sequelize=require('../util/database')

const SignUp=sequelize.define('signup',{
    id: {
        type: Sequelize.INTEGER,
        // defaultValue: Sequelize.UUIDV4,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name:{
        type:Sequelize.STRING,
        allowNull:false
    },
    email:{
        type:Sequelize.STRING,
        allowNull:false
    }, 
    phone:{
        type:Sequelize.BIGINT,
        allowNull:false
    },
    password:{
        type:Sequelize.STRING,
        allowNull:false
    },
   

})

module.exports=SignUp;