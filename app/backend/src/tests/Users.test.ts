import * as chai from 'chai';
import * as sinon from 'sinon';
import * as dotenv from 'dotenv';
import { verifyToken, createToken } from '../utils/jwtToken';
import * as bcrypt from 'bcryptjs';
import inputLogin from '../validations/inputLogin';
// @ts-ignore
import chaiHttp = require('chai-http');
import { app } from '../app';
import { Response } from 'superagent';
import { AssertionError } from 'chai';

dotenv.config();

chai.use(chaiHttp);

const { expect } = chai;

describe('Testando Users', () => {
    let chaiHttpResponse: Response;

    afterEach(() => {
        sinon.restore();
    });

    it('Testa se o login foi feito com sucesso', async () => {
        const body = {
            email: 'user@user.com',
            password: 'secret_user',
        };

        const response = await chai.request(app).post('/login').send(body);

        expect(response.status).to.be.equal(200);
        expect(response.body).to.haveOwnProperty('token');
    });


    it('Testa a rota login/role do tipo "get" se retorna mensagem de erro com token inválido', async () => {
        const userLogin = {
            email: 'admin@admin.com',
            password: 'blablabla',
        };

        const createTokenResult = await createToken(userLogin);
        const result = await verifyToken(createTokenResult);

        chaiHttpResponse = await chai.request(app).get('/login/role').send(result);

        expect(chaiHttpResponse.status).to.be.equal(401);
        expect(chaiHttpResponse.text).to.be.equal('{"message":"Token not found"}');
    });

    it('Testa se passando uma senha e email corretos, o login é feito com sucesso', async () => {
        const body = {
            email: 'admin@admin.com',
            password: 'secret_admin',
        };

        const response = await chai.request(app).post('/login').send(body);

        expect(response.status).to.be.equal(200);
        expect(response.body).to.haveOwnProperty('token');
    });

    it('Testa se passando uma senha e email incorretos, o login não é feito', async () => {
        const body = {};

        const response = await chai.request(app).post('/login').send(body);

        expect(response.status).to.be.equal(400);
        expect(response.body).to.haveOwnProperty('message');
        expect(response.body.message).to.be.equal('All fields must be filled');
    });

    it('Testa se passando uma senha e email incorretos, o login não é feito', async () => {
        const body = {
            email: 'adminadmin.com',
            password: 'secret_admin',
        };

        const response = await chai.request(app).post('/login').send(body);

        expect(response.status).to.be.equal(401);
        expect(response.body).to.haveOwnProperty('message');
        expect(response.body.message).to.be.equal('Invalid email or password');
    });

    it('Testa se o bcrypt foi chamado com sucesso', async () => {
        const passwordValid = 'secret_admin';

        const body = {
            email: 'admin@admin.com',
            password: 'secret_aaaaadmin',
        };

        const cryptUserPasswordVal = bcrypt.hashSync(passwordValid, 10);
        const cryptUserPassword = bcrypt.hashSync(body.password, 10);
        const bCryptStub = sinon.stub(bcrypt, 'compareSync').returns(cryptUserPassword === cryptUserPasswordVal);
        const response = await chai.request(app).post('/login').send(body);

        expect(response.status).to.be.equal(401);
        expect(response.body).to.haveOwnProperty('message');
        expect(response.body.message).to.be.equal('Invalid email or password');
        expect(bCryptStub.calledOnce).to.be.true;

        bCryptStub.restore();
    });

    it('Testa o inputLogin', async () => {
        const user = {
            email: '',
            password: '',
        };

        const result = inputLogin(user);

        expect(AssertionError).to.be.an('function');
        expect(result?.message).to.be.equal('"email" is not allowed to be empty');
    });

    it('Testa a rota login/role do tipo "get" se passar um "role = admin" e retorna o role', async () => {
        const userLogin = {
            email: process.env.EMAIL,
            password: process.env.PASSWORD,
        };

        const createTokenResult = await createToken(userLogin);

        chaiHttpResponse = await chai.request(app)
        .get('/login/role')
        .set('authorization', createTokenResult)
        .send();

        expect(chaiHttpResponse.status).to.be.equal(200);
    });
});
