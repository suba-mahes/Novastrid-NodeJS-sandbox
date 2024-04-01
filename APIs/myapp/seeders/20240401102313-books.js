'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('books',[
      {
        book_name : 'aaa',
        author: 'zzz'
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('books', { author: 'zzz' });
  }
};
