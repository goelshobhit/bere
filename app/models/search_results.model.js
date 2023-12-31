module.exports = (sequelize, Sequelize) => {
  const SearchResult = sequelize.define("search_results", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    search_uid: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
    },
    search_date: {
      type: Sequelize.DATE
    },
    search_keyword: {
      type: Sequelize.STRING(50)
    }, 
    search_results: {
      type: Sequelize.DataTypes.JSONB,
      //type: Sequelize.TEXT
      allowNull: false,
    }, 
    search_results_url: {
      type: Sequelize.STRING(255),
      allowNull: true
    }
  });
  return SearchResult;
};