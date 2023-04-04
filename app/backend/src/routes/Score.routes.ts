import { Router, Request, Response } from 'express';
import LeaderboardController from '../controllers/Score.controller';

const leaderboardController = new LeaderboardController();

const leaderboardRouter = Router();

leaderboardRouter.get(
  '/home',
  (req: Request, res: Response) => leaderboardController.leaderboardRank(req, res),
);
leaderboardRouter.get(
  '/away',
  (req: Request, res: Response) => leaderboardController.leaderboardAway(req, res),
);

leaderboardRouter.get(
  '/',
  (req: Request, res: Response) => leaderboardController.leaderboardHomeAndAway(req, res),
);

export default leaderboardRouter;
