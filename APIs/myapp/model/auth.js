
module.exports = (sequelize,Sequelize) =>{
    const Auth = sequelize.define("auth",{
      auth_id: {
          allowNull: false,
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      email_id:{
        allowNull: true,
        type:Sequelize.STRING,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      }
    });
    return Auth;
}