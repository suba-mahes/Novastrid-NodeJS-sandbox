
module.exports = (sequelize,Sequelize,actor,movie) =>{
    const ActorMovie = sequelize.define("ActorMovie",{
      movie_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      actor_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      }
    },
      {
        timestamps: false,
      }
);
    return ActorMovie;
}