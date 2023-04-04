import { ModelStatic } from 'sequelize';
import IScoreBoard from '../interfaces/IScoreBoard';
import Team from '../database/models/Team';
import Matche from '../database/models/Matche';
import IResponse from '../interfaces/IResponse';

const count = (str: string, arr: string[]) =>
  arr.filter((item) => item === str).length;

const matcheResults = (matches: Matche[]) =>
  matches.map((match) => {
    if (match.homeTeamGoals > match.awayTeamGoals) {
      return 'victory';
    } if (match.homeTeamGoals === match.awayTeamGoals) {
      return 'draw';
    }
    return 'loss';
  });

const expression = (results: string[], matches: Matche[]) => {
  let goalsFavor = 0;
  let goalsOwn = 0;

  matches.forEach((match) => {
    goalsFavor += match.homeTeamGoals;
    goalsOwn += match.awayTeamGoals;
  });

  const oneExpression = count('victory', results) * 3 + count('draw', results);
  const twoExpression = matches.length * 3;
  const threeExpression = oneExpression / twoExpression;
  const fourExpression = threeExpression * 100;
  const fiveExpression = fourExpression.toString();
  const sixExpression = fiveExpression.slice(0, 5);
  const sevenExpression = parseFloat(sixExpression);
  const eightExpression = Number.isNaN(sevenExpression) ? 0 : sevenExpression;

  return { goalsFavor, goalsOwn, efficiency: eightExpression };
};

const calculateRanking = (team: Team, results: string[], matches: Matche[]) => {
  let goalsFavor = 0;
  let goalsOwn = 0;

  matches.forEach((match) => {
    goalsFavor += match.homeTeamGoals;
    goalsOwn += match.awayTeamGoals;
  });

  return {
    name: team.teamName,
    totalPoints: count('victory', results) * 3 + count('draw', results),
    totalGames: matches.length,
    totalVictories: count('victory', results),
    totalDraws: count('draw', results),
    totalLosses: count('loss', results),
    goalsFavor,
    goalsOwn,
    goalsBalance: goalsFavor - goalsOwn,
    efficiency: Number(expression(results, matches).efficiency.toFixed(2)),
  };
};

const sortResult = (result: IScoreBoard[]) => {
  result.sort((a, b) =>
    b.totalPoints - a.totalPoints
    || b.totalVictories - a.totalVictories
    || b.goalsBalance - a.goalsBalance
    || b.goalsFavor - a.goalsFavor);

  return result;
};

class ScoreService {
  private team: ModelStatic<Team> = Team;
  private matches: ModelStatic<Matche> = Matche;

  async leaderboardHome(): Promise<IResponse> {
    const [teams, matches] = await Promise.all([
      this.team.findAll(),
      this.matches.findAll({ where: { inProgress: false } }),
    ]);

    const result: IScoreBoard[] = teams.map((team) => {
      const teamMatches = matches.filter((match) => match.homeTeamId === team.id);
      const teamResults = matcheResults(teamMatches);
      return calculateRanking(team, teamResults, teamMatches);
    });

    sortResult(result);
    return ScoreService.successResponse(200, result);
  }

  async leaderboardAway(): Promise<IResponse> {
    const [teams, matches] = await Promise.all([
      this.team.findAll(),
      this.matches.findAll({ where: { inProgress: false } }),
    ]);

    const result: IScoreBoard[] = teams.map((team) => {
      const teamMatches = matches.filter((match) => match.awayTeamId === team.id);
      const teamResults = matcheResults(teamMatches);
      return calculateRanking(team, teamResults, teamMatches);
    });

    sortResult(result);
    return ScoreService.successResponse(200, result);
  }

  async leaderboardHomeAndAway(): Promise<IResponse> {
    const [teams, matches] = await Promise.all([
      this.team.findAll(),
      this.matches.findAll({ where: { inProgress: false } }),
    ]);

    const result: IScoreBoard[] = teams.map((team) => {
      const teamMatches = matches.filter(
        (match) => match.homeTeamId === team.id || match.awayTeamId === team.id,
      );

      const teamResults = matcheResults(teamMatches);
      return calculateRanking(team, teamResults, teamMatches);
    });

    sortResult(result);
    return ScoreService.successResponse(200, result);
  }

  private static successResponse(status: number, message: unknown): IResponse {
    return { status, message };
  }
}

export default ScoreService;
