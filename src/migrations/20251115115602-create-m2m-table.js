/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ProductTags", {
      productId: {
        type: Sequelize.STRING,
        references: {
          model: "products",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        primaryKey: true,
      },
      tagId: {
        type: Sequelize.STRING,
        references: {
          model: "tags",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        primaryKey: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("ProductTags");
  },
};
