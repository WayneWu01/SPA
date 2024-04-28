/*
 * Test suite for articles
 */
require('es6-promise').polyfill();
require('isomorphic-fetch');

const url = path => `http://localhost:3000${path}`;
let cookie;

describe('Validate headline functionality', () => {

    it('login user', (done) => {
        fetch(url('/login'), {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ username: 'newuser2', password: '123' })
        }).then(r => {
            cookie = r.headers.get('set-cookie').split(';')[0];
            return r.json();
        }).then(res => {
            expect(res.username).toEqual('newuser2');
            expect(res.result).toEqual('success');
            done();
        });
    });

    it('get headline', (done) => {
        fetch(url('/headline'), {
            method: 'GET',
            headers: { 'Cookie': cookie }
        }).then(r => r.json()).then(res => {
            expect(res.username).toEqual('newuser2');
            done();
        });
    });

    it('update headline', (done) => {
        const newHeadline = 'Updated Headline4';
        fetch(url('/headline'), {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookie
            },
            body: JSON.stringify({ headline: newHeadline })
        }).then(r => r.json()).then(res => {
            expect(res.username).toEqual('newuser2');
            expect(res.headline).toEqual(newHeadline);
            done();
        });
    });

});
