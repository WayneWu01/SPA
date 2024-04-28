/*
 * Test suite for articles
 */
require('es6-promise').polyfill();
require('isomorphic-fetch');

const url = path => `http://localhost:3000${path}`;
let cookie;

describe('Validate auth functionality', () => {
    it('register new user', (done) => {
        fetch(url('/register'), {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                username: 'test3' + Math.floor(Math.random() * 10000).toString(),
                password: '123456',
                email: '123@12.com',
                zipcode: '12345',
                phone: '1234567890',
                dob:'1234-12-12',
            })
        }).then(r => r.json()).then(res => {
            expect(res.result).toEqual('success');
            done()
        })
    });

    it('login user', (done) => {
        fetch(url('/login'), {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ username: 'test', password: '123456' })
        }).then(r => {
            cookie = r.headers.get('set-cookie').split(';')[0]; // Save the cookie for logout
            return r.json();
        }).then(res => {
            expect(res.username).toEqual('test');
            expect(res.result).toEqual('success');
            done();
        });
    });

    it('logout user', (done) => {
        fetch(url('/logout'), {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookie
            }
        }).then(r => r.json()).then(res => {
            expect(res.result).toEqual('OK');
            done();
        });
    });
});
