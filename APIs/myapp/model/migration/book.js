
module.exports = (sequelize,Sequelize) =>{
    const Book = sequelize.define("book",{
      id: {
          allowNull: false,
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true
      },
      book_name: {
        allowNull: false,
        type: Sequelize.STRING
      },
    }, 
    {
      timestamps: false,
    }
  );
    return Book;
}