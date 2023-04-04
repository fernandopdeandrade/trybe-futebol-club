import { Router, Request, Response } from 'express';
import TeamsController from '../controllers/Teams.controller';
import TeamsService from '../services/Teams.service';

const routerTeams = Router();

const teamsService = new TeamsService();
const teamsController = new TeamsController(teamsService);

routerTeams.get('/', (req: Request, res: Response) => {
  teamsController.getAllTeamsController(req, res);
});

routerTeams.get('/:id', (req: Request, res: Response) => {
  teamsController.getByIdTeamsController(req, res);
});

export default routerTeams;
