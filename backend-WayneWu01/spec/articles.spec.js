/*
 * Test suite for articles
 */
require('es6-promise').polyfill();
require('isomorphic-fetch');

const url = path => `http://localhost:3000${path}`;
let cookie;
let count;
describe('Validate articles functionality', () => {
    beforeEach((done) => {
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
            return fetch(url('/articles/'), {
                method: 'GET',
                headers: {Cookie: cookie}
            });
        }).then(r => r.json()).then(res => {
            count = res['articles'].length; // Initialize the count here
            done();
        });
    });

    it('get article with valid id', (done) => {
        fetch(url('/articles/65518c30243150b514bff110'), {
            method: 'GET',
            headers: {Cookie: cookie},
        }).then(r => r.json()).then(res => {
            expect(res['articles'].length).toBe(1);
            done();
        });
    });

    it('get article with valid username', (done) => {
        fetch(url('/articles/newuser2'), {
            method: 'GET',
            headers: {Cookie: cookie},
        }).then(r => r.json()).then(res => {
            expect(res['articles'].length).toBe(count);
            done();
        });
    });

    it('get article with empty', (done) => {
        fetch(url('/articles/'), {
            method: 'GET',
            headers: {Cookie: cookie},
        }).then(r => r.json()).then(res => {
            expect(res['articles'].length).toBe(count);
            done();
        });
    });

    it('get article with invalid id', (done) => {
        fetch(url('/articles/123'), {
            method: 'GET',
            headers: {Cookie: cookie},
        }).then(r => r.json()).then(res => {
            expect(res.error).toEqual('No articles found');
            done();
        });
    });

    it('should create a new article', (done) => {
        const newArticleData = {
            text: "Sample article content",
        };

        fetch(url('/article'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Cookie: cookie
            },
            body: JSON.stringify(newArticleData)
        }).then(r => r.json()).then(res => {
            count += 1;
            expect(res.articles[0].text).toEqual(newArticleData.text);
            done();
        });
    });
});
