
module.exports = (sequelize,Sequelize) =>{
    const User = sequelize.define("user",{
        user_id: {
            allowNull: false,
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
          },
         first_name: {
           allowNull: false,
           type: Sequelize.STRING
         },
         last_name: {
           allowNull: false,
           type: Sequelize.STRING
         },
         email_id:{
           allowNull: true,
           type:Sequelize.STRING,
           unique: true
         }
    });
    return User;
}