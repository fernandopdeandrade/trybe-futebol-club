import * as sinon from 'sinon';
import * as chai from 'chai';

// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import { Response } from 'superagent';

import Team from '../database/models/Team';
import { TeamsMock } from './mocks/Teams.mock';

chai.use(chaiHttp);

const { expect } = chai;

describe('Testando Teams', () => {
    let chaiHttpResponse: Response;

    beforeEach(async () => {
        sinon
            .stub(Team, "findAll")
            .resolves(TeamsMock);
    });

    afterEach(() => {
        (Team.findAll as sinon.SinonStub).restore();
    })

    it('esta testando o "GET" da rota "teams"', async () => {
        chaiHttpResponse = await chai
            .request(app).get('/teams')
        expect(chaiHttpResponse.status).to.be.eq(200);
        expect(chaiHttpResponse.body[0]).to.be.deep.eq(TeamsMock[0]);
    });

    it('esta testando o "GET" da rota "teams"/:id', async () => {
        chaiHttpResponse = await chai
            .request(app).get('/teams/3')

        expect(chaiHttpResponse.status).to.be.eq(200);
        expect(chaiHttpResponse.body[3]).to.be.deep.eq(TeamsMock[3]);
    });
});
