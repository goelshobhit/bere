module.exports = (sequelize, Sequelize) => {
  const SearchObject = sequelize.define("search_objects", {
    search_obj_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    search_obj_category: {
      type: Sequelize.STRING(100)
    },
    is_active: {
      type: Sequelize.INTEGER
    }
  }, {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    freezeTableName: true,
    tableName: 'search_objects',
    underscored: true
});
  return SearchObject;
};