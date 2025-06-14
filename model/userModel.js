module.exports = (sequelize,DataTypes)=>{
      const User = sequelize.define('user',{
            username : {
                  type : DataTypes.STRING,
                  allowNull : false                
            },
            email : {
                  type : DataTypes.STRING,
                  allowNull : false                
            },
            password : {
                  type : DataTypes.STRING,
                  allowNull : false                
            },
            otp : {
                  type : DataTypes.INTEGER,
                  allowNull : true                
            },
            otpGeneratedTime : {
                  type : DataTypes.STRING,
                  allowNull : true                
            }            
      })
      return User 
}

