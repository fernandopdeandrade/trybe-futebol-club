import { Request, Response } from 'express';
import LeaderboardService from '../services/Score.service';

class LeaderboardController {
  constructor(private leaderboardService = new LeaderboardService()) { }

  async leaderboardRank(_req: Request, res: Response) {
    const result = await this.leaderboardService.leaderboardHome();
    res.status(result.status).json(result.message);
  }

  async leaderboardAway(_req: Request, res: Response) {
    const result = await this.leaderboardService.leaderboardAway();
    res.status(result.status).json(result.message);
  }

  async leaderboardHomeAndAway(_req: Request, res: Response) {
    const result = await this.leaderboardService.leaderboardHomeAndAway();
    res.status(result.status).json(result.message);
  }
}

export default LeaderboardController;
