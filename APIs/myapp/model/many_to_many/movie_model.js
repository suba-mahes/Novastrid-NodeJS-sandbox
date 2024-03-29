
module.exports = (sequelize,Sequelize) =>{
    const Movie = sequelize.define("movie",{
        movie_id: {
            allowNull: false,
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
          },
        movie_name: {
          allowNull: false,
          type: Sequelize.STRING
        }
      }, 
      {
        timestamps: false, 
      }
    );
    return Movie;
}