import * as sinon from 'sinon';
import * as chai from 'chai';
import { createToken, verifyToken } from '../utils/jwtToken';
import * as dotenv from 'dotenv';
import { Model } from 'sequelize';
import * as jwt from 'jsonwebtoken';

dotenv.config();

// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import { Response } from 'superagent';

import Matche from '../database/models/Matche';
import {
    finishedMatches,
    newMatchMock,
    updateMatchesMock,
    newMatchReturnMock,
    matchesEquals,
    matchesIncorrect
} from './mocks/Maches.mock';

chai.use(chaiHttp);

const { expect } = chai;

describe('Testando Matches', () => {
    let chaiHttpResponse: Response;

    afterEach(() => {
        sinon.restore();
    });

    it('esta testando o "GET" da rota "matches"', async () => {
        const result = {
            id: 1,
            homeTeamId: 16,
            awayTeamId: 8,
            homeTeamGoals: 1,
            awayTeamGoals: 1,
            inProgress: false,
            homeTeam: { id: 16, teamName: 'São Paulo' },
            awayTeam: { id: 8, teamName: 'Grêmio' }

        },

            chaiHttpResponse = await chai
                .request(app).get('/matches')

        expect(chaiHttpResponse.status).to.be.eq(200);
        expect(chaiHttpResponse.body).to.be.an('array');
        expect(chaiHttpResponse.body[0]).to.be.deep.eq(result);
    });

    it('esta testando o "GET" da rota "matches?inProgress=true"', async () => {
        chaiHttpResponse = await chai
            .request(app).get('/matches?inProgress=true')

        expect(chaiHttpResponse.status).to.be.eq(200);
    });

    it('esta testando o "GET" da rota "matches?inProgress=false"', async () => {
        chaiHttpResponse = await chai
            .request(app).get('/matches?inProgress=false')

        expect(chaiHttpResponse.status).to.be.eq(200);
    });

    it('esta testando a rota sem o token de verificação', async () => {
        sinon
            .stub(Model, 'update').resolves();
        const response = await chai
            .request(app).patch('/matches/1/finish');

        expect(response.status).to.be.eq(401);
        expect(response.body).to.be.deep.eq({ message: 'Token not found' });
    });

    it('testando o "PATCH" da rota "matches/:id/finish" com um token inválido', async () => {
        sinon
            .stub(Model, 'update').resolves();
        const token = await createToken({ email: process.env.EMAIL, password: process.env.PASSWORD });

        const response = await chai
            .request(app).patch('/matches/1/finish')
            .set('Authorization', `Bearer ${token}123`);

        expect(response.status).to.be.eq(401);
        expect(response.body).to.be.deep.eq({ message: 'Token must be a valid token' });
    });

    it('testando createToken e verifyToken', async () => {
        const token = await createToken({ email: process.env.EMAIL, password: process.env.PASSWORD });
        const result = await verifyToken(token);
        const { data } = result as any;

        expect(data).to.be.deep.eq({ email: process.env.EMAIL, password: process.env.PASSWORD });
    });

    it('testando que não pode ser possível finalizar um jogo já finalizado, espera-se uma mensagem', async () => {
        const user = { email: process.env.EMAIL, password: process.env.PASSWORD };
        const token = await createToken(user);

        sinon.stub(Matche, 'update').resolves([1])
        sinon.stub(jwt, 'verify').resolves(user);
        sinon.stub(jwt, 'decode').resolves(user);

        const response = await chai.request(app).patch('/matches/1/finish').send().auth(token, { type: 'bearer' });

        expect(response.body).to.be.deep.eq("Matche already finished");

        sinon.restore();
    });

    it('testando que não é possível finalizar um jogo que não existe', async () => {
        const user = { email: process.env.EMAIL, password: process.env.PASSWORD };
        const token = await createToken(user);

        sinon.stub(Matche, 'update').resolves([1])
        sinon.stub(jwt, 'verify').resolves(user);
        sinon.stub(jwt, 'decode').resolves(user);

        const response = await chai.request(app).patch('/matches/100/finish').send(finishedMatches).auth(token, { type: 'bearer' });

        expect(response.body).to.be.deep.eq("Matche not found");

        sinon.stub(Matche, 'findAll').resolves(finishedMatches);
    });

    it('Se é possivel atualizar uma partida', async () => {
        const user = { email: process.env.EMAIL, password: process.env.PASSWORD };
        const token = await createToken(user);

        sinon.stub(Matche, 'update').resolves([1])
        sinon.stub(jwt, 'verify').resolves(user);
        sinon.stub(jwt, 'decode').resolves(user);

        const response = await chai.request(app).patch('/matches/45').send(updateMatchesMock).auth(token, { type: 'bearer' });

        expect(response.status).to.be.eq(200);
        expect(response.body).to.be.deep.eq("Updated successfully");

        sinon.restore();
    });

    it('Se não envias os dados para atualizar a partida, espera-se um erro', async () => {
        const user = { email: process.env.EMAIL, password: process.env.PASSWORD };
        const token = await createToken(user);

        sinon.stub(Matche, 'update').resolves([1])
        sinon.stub(jwt, 'verify').resolves(user);
        sinon.stub(jwt, 'decode').resolves(user);

        const response = await chai.request(app).patch('/matches/45').send({}).auth(token, { type: 'bearer' });

        expect(response.status).to.be.eq(400);
        expect(response.body).to.be.deep.eq({ message: 'All fields must be filled correctly' });

        sinon.restore();
    });

    it('Se não é possivel atualizar uma partida que não existe', async () => {
        const user = { email: process.env.EMAIL, password: process.env.PASSWORD };
        const token = await createToken(user);

        sinon.stub(Matche, 'update').resolves([0])
        sinon.stub(jwt, 'verify').resolves(user);
        sinon.stub(jwt, 'decode').resolves(user);

        const response = await chai.request(app).patch('/matches/100').send(updateMatchesMock).auth(token, { type: 'bearer' });

        expect(response.status).to.be.eq(404);
        expect(response.body).to.be.deep.eq("Matche not found");

        sinon.restore();
    });

    it('Se que não é possivel atualizar uma partida que já está finalizada', async () => {
        const user = { email: process.env.EMAIL, password: process.env.PASSWORD };
        const token = await createToken(user);

        sinon.stub(Matche, 'update').resolves([10])
        sinon.stub(jwt, 'verify').resolves(user);
        sinon.stub(jwt, 'decode').resolves(user);

        const response = await chai.request(app).patch('/matches/10').send(updateMatchesMock).auth(token, { type: 'bearer' });

        expect(response.status).to.be.eq(400);
        expect(response.body).to.be.deep.eq("Matche already finished");

        sinon.restore();
    });

    it('Se é possível criar uma nova partida', async () => {
        const user = { email: process.env.EMAIL, password: process.env.PASSWORD };
        const token = await createToken(user);

        sinon.stub(Matche, 'create').resolves(newMatchReturnMock as any)
        sinon.stub(jwt, 'verify').resolves(user);
        sinon.stub(jwt, 'decode').resolves(user);

        const response = await chai.request(app).post('/matches').send(newMatchMock).auth(token, { type: 'bearer' });

        expect(response.status).to.be.eq(201);
        expect(response.body).to.be.deep.eq(newMatchReturnMock);

        sinon.restore();
    });

    it('testa que não é possível criar uma nova partida com dois times iguais', async () => {
        const user = { email: process.env.EMAIL, password: process.env.PASSWORD };
        const token = await createToken(user);

        sinon.stub(Matche, 'create').resolves([1] as any);
        sinon.stub(jwt, 'verify').resolves(user);
        sinon.stub(jwt, 'decode').resolves(user);

        const response = await chai.request(app).post('/matches').send(matchesEquals).auth(token, { type: 'bearer' });

        expect(response.status).to.be.eq(422);
        expect(response.body).to.be.deep.eq({ message: 'It is not possible to create a match with two equal teams' });

        sinon.restore();
    });

    it('testa que não é possível criar uma nova partida sem passar os dois times ou um dos dois no "body"', async () => {
        const user = { email: process.env.EMAIL, password: process.env.PASSWORD };
        const token = await createToken(user);

        sinon.stub(Matche, 'create').resolves([1] as any);
        sinon.stub(jwt, 'verify').resolves(user);
        sinon.stub(jwt, 'decode').resolves(user);

        const response = await chai.request(app).post('/matches').send(matchesIncorrect).auth(token, { type: 'bearer' });

        expect(response.status).to.be.eq(404);
        expect(response.body).to.be.deep.eq({ message: 'There is no team with such id!' });

        sinon.restore();
    });

    it('testando se é possível finalizar um jogo pelo id', async () => {
        const user = { email: process.env.EMAIL, password: process.env.PASSWORD };
        const token = await createToken(user);

        sinon.stub(Matche, 'update').resolves([47])
        sinon.stub(jwt, 'verify').resolves(user);
        sinon.stub(jwt, 'decode').resolves(user);

        const response = await chai.request(app).patch('/matches/47/finish').send().auth(token, { type: 'bearer' });

        expect(response.body).to.be.deep.eq("Finished");
    });
});
