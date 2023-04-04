import { Request, Response } from 'express';
import TeamsService from '../services/Teams.service';

class TeamsController {
  constructor(private teamsService: TeamsService = new TeamsService()) { }

  public async getAllTeamsController(_req: Request, res: Response) {
    const teams = await this.teamsService.getAllTeamsService();
    res.status(200).json(teams);
  }

  public getByIdTeamsController = async (req: Request, res: Response) => {
    const { id } = req.params;
    const team = await this.teamsService.getByIdTeamsService(id);
    res.status(200).json(team);
  };
}

export default TeamsController;
