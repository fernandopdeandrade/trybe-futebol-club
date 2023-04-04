import { Router, Request, Response } from 'express';
import MatchesController from '../controllers/Matches.controller';
import MatchesService from '../services/Matches.service';
import tokenValidation from '../middlewares/validateTokenJwt';

const routerMatches = Router();

const matchesService = new MatchesService();
const matchesController = new MatchesController(matchesService);

routerMatches.get('/', (req: Request, res: Response) => {
  matchesController.geAllMacthesController(req, res);
});

routerMatches.patch(
  '/:id',
  tokenValidation,
  (req: Request, res: Response) => {
    matchesController.matcheUpdateController(req, res);
  },
);

routerMatches.patch(
  '/:id/finish',
  tokenValidation,
  (req: Request, res: Response) => {
    matchesController.matcheFinishedController(req, res);
  },
);

routerMatches.post('/', tokenValidation, (req: Request, res: Response) => {
  matchesController.matcheCreateController(req, res);
});

export default routerMatches;
