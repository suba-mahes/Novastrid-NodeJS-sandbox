module.exports = (sequelize, Sequelize) => {
  const Actor = sequelize.define(
    "actor",
    {
      actor_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      first_name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      last_name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
    },
    {
      timestamps: false,
    }
  );
  return Actor;
};
