import { ModelStatic } from 'sequelize';
import Matche from '../database/models/Matche';
import Team from '../database/models/Team';
import IResponse from '../interfaces/IResponse';
import IUpdateMatch from '../interfaces/IUpdateMatch';
import ICreateMatch from '../interfaces/iCreateMatch';

class MatchesService {
  protected model: ModelStatic<Matche> = Matche;

  async getAllMatches() {
    return this.model.findAll({
      include: [
        { model: Team, as: 'homeTeam' },
        { model: Team, as: 'awayTeam' },
      ],
    });
  }

  async getAllMatchesService(inProgress: string): Promise<IResponse> {
    const resultMatches = await this.model.findAll({
      include: [
        { model: Team, as: 'homeTeam' },
        { model: Team, as: 'awayTeam' },
      ],
    });

    if (inProgress === 'true') {
      return { status: 200, message: resultMatches.filter((match) => match.inProgress === true) };
    }

    return { status: 200, message: resultMatches.filter((match) => match.inProgress === false) };
  }

  async matcheFinishedService(id: number | string): Promise<IResponse> {
    const matche = await this.model.findByPk(id);

    if (!matche) {
      return { status: 404, message: 'Matche not found' };
    }

    if (matche.inProgress === false) {
      return { status: 400, message: 'Matche already finished' };
    }

    matche.inProgress = false;
    await matche.save();

    return { status: 200, message: 'Finished' };
  }

  async matcheUpdateService(id: number | string, body: IUpdateMatch): Promise<IResponse> {
    const matche = await this.model.findByPk(id);

    if (!matche) {
      return { status: 404, message: 'Matche not found' };
    }

    if (matche.inProgress === false) {
      return { status: 400, message: 'Matche already finished' };
    }

    matche.homeTeamGoals = body.homeTeamGoals;
    matche.awayTeamGoals = body.awayTeamGoals;
    await matche.save();

    return { status: 200, message: 'Updated successfully' };
  }

  async createMatcheService(body: ICreateMatch): Promise<IResponse> {
    if (body.homeTeamId === body.awayTeamId) {
      return MatchesService.errorResponse(
        422,
        'It is not possible to create a match with two equal teams',
      );
    }

    const homeTeam = await this.model.findByPk(body.homeTeamId);
    const awayTeam = await this.model.findByPk(body.awayTeamId);

    if (!homeTeam || !awayTeam) {
      return MatchesService.errorResponse(404, 'There is no team with such id!');
    }

    const matche = await this.model.create({
      ...body,
      inProgress: true,
    });

    return { status: 201, message: matche };
  }

  private static successResponse(status: number, message: unknown): IResponse {
    return { status, message };
  }

  private static errorResponse(status: number, message: unknown): IResponse {
    return MatchesService.successResponse(status, { message });
  }
}

export default MatchesService;
