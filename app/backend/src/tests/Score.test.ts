import * as sinon from 'sinon';
import * as chai from 'chai';

// @ts-ignore
import * as chaiHttp from 'chai-http';
import { app } from '../app';
import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

import {
    resultScoreMockHome,
    resultScoreMockAway,
    resultScoreMockHomeAway
} from './mocks/Score.mock';

describe('Tetando Score', () => {
    let chaiHttpResponse: Response;

    afterEach(() => {
        sinon.restore();
    });

    it('esta testando o "GET" da rota "/leaderboard/home"', async () => {
        chaiHttpResponse = await chai
            .request(app).get('/leaderboard/home')

        expect(chaiHttpResponse.status).to.be.eq(200);
        expect(chaiHttpResponse.body).to.be.an('array');
        expect(chaiHttpResponse.body).to.be.deep.eq(resultScoreMockHome);
    });

    it('esta testando o "GET" da rota "/leaderboard/away"', async () => {
        chaiHttpResponse = await chai
            .request(app).get('/leaderboard/away')

        expect(chaiHttpResponse.status).to.be.eq(200);
        expect(chaiHttpResponse.body).to.be.an('array');
        expect(chaiHttpResponse.body[0]).to.be.deep.eq(resultScoreMockAway[0]);
    });

    it('esta testando o "GET" da rota "/leaderboard", referente a home && away', async () => {
        chaiHttpResponse = await chai
            .request(app).get('/leaderboard')

        expect(chaiHttpResponse.status).to.be.eq(200);
        expect(chaiHttpResponse.body).to.be.an('array');
        expect(chaiHttpResponse.body[0]).to.be.deep.eq(resultScoreMockHomeAway[0]);
    });

    it('esta testando o arquivo "server.ts"', async () => {
        chaiHttpResponse = await chai
            .request(app).get('/')
        expect(chaiHttpResponse.status).to.be.eq(200);
        expect(chaiHttpResponse.text).to.be.eq('{"ok":true}');
    });
});