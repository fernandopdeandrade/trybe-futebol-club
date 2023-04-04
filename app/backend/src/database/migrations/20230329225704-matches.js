'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('matches',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false
        },
        homeTeamId: {
          type: Sequelize.INTEGER,
          field: 'home_team_id',
          references: { model: 'teams', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        awayTeamId: {
          type: Sequelize.INTEGER,
          field: 'away_team_id',
          references: { model: 'teams', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        homeTeamGoals: {
          type: Sequelize.INTEGER,
          field: 'home_team_goals',
          allowNull: false,
        },
        awayTeamGoals: {
          type: Sequelize.INTEGER,
          field: 'away_team_goals',
          allowNull: false,
        },
        inProgress: {
          type: Sequelize.BOOLEAN,
          field: 'in_progress',
          allowNull: false,
        },
      }
    );
  },

  down: async (queryInterface, _Sequelize) => {
    await queryInterface.dropTable('matches');
  }
};
