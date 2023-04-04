import { Model, DataTypes } from 'sequelize';
import db from '.';
import Team from './Team';

class Matche extends Model {
  declare readonly id: number;
  declare homeTeamId: number;
  declare awayTeamId: number;
  declare homeTeamGoals: number;
  declare awayTeamGoals: number;
  declare inProgress: boolean;
}

Matche.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  homeTeamId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Team, key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  awayTeamId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Team, key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  homeTeamGoals: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  awayTeamGoals: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  inProgress: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
}, {
  sequelize: db,
  modelName: 'Matches',
  tableName: 'matches',
  underscored: true,
  timestamps: false,
});

Matche.belongsTo(Team, { as: 'homeTeam', foreignKey: 'homeTeamId' });
Matche.belongsTo(Team, { as: 'awayTeam', foreignKey: 'awayTeamId' });

export default Matche;
