import { ModelStatic } from 'sequelize';
import Team from '../database/models/Team';

class TeamsService {
  private model: ModelStatic<Team> = Team;

  public async getAllTeamsService(): Promise<Team[]> {
    return this.model.findAll();
  }

  public async getByIdTeamsService(id: number | string): Promise<Team | null> {
    return this.model.findByPk(id);
  }
}

export default TeamsService;
