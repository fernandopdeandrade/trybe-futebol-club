import { Request, Response } from 'express';
import MatchesService from '../services/Matches.service';

class MatchesController {
  constructor(private matchesService: MatchesService = new MatchesService()) { }

  public async geAllMacthesController(req: Request, res: Response) {
    if (req.query.inProgress) {
      const { inProgress } = req.query;
      const matchesProgress = await this.matchesService
        .getAllMatchesService(inProgress as string);
      return res.status(matchesProgress.status).json(matchesProgress.message);
    }
    const matchesAll = await this.matchesService.getAllMatches();
    return res.status(200).json(matchesAll);
  }

  public async matcheFinishedController(req: Request, res: Response) {
    const { id } = req.params;
    const matche = await this.matchesService.matcheFinishedService(id);
    return res.status(matche.status).json(matche.message);
  }

  public async matcheUpdateController(req: Request, res: Response) {
    if (!req.body.homeTeamGoals || !req.body.awayTeamGoals) {
      return res.status(400).json({ message: 'All fields must be filled correctly' });
    }
    const { id } = req.params;
    const matche = await this.matchesService.matcheUpdateService(id, req.body);
    return res.status(matche.status).json(matche.message);
  }

  public async matcheCreateController(req: Request, res: Response) {
    const matche = await this.matchesService.createMatcheService(req.body);
    return res.status(matche.status).json(matche.message);
  }
}

export default MatchesController;
