const request = require('supertest')
const app = require('../app')
const db = require('../db/connection')
const seed = require('../db/seeds/seed')
const testData = require('../db/data/test-data')
  
beforeEach(() => seed(testData))
afterAll(() => db.end())

describe('app', () => {
    it('when invalid endpoint, give 404', () => {
       return request(app)
       .get('/api/non-existent-endpoint')
       .expect(404)
    })
    describe('GET /api/topics', () => {
        it('should respond with an array of topic objects', () => {
            return request(app)
            .get('/api/topics')
            .expect(200)
            .expect(({body}) => {
                // console.log(body)
                expect(body.topics).toHaveLength(3)
                body.topics.forEach((topic) => {
                    expect(typeof topic.slug).toBe('string')
                    expect(typeof topic.description).toBe('string')
                })
            })
        })
    })
    describe('GET /api', () => {
        test('Return a object with all the endpoints', () => {
            return request(app)
            .get('/api')
            .expect(200)
            .then(({body}) => {
                // console.log(body)
                expect(body.endpoints).toHaveProperty('GET /api/topics')
                expect(body.endpoints['GET /api/topics']).toEqual(
                    expect.objectContaining({
                        description: expect.any(String),
                        exampleResponse: expect.any(Object)
                    })
                )
            })
        })
    })
    describe('GET /api/articles/:article_id', () => {
        it('return article object for a valid id', () => {
            return request(app)
                .get('/api/articles/1')
                .expect(200)
                .then(({body}) => {
                    expect(body.article).toEqual(
                        {author: 'butter_bridge',
                        title: 'Living in the shadow of a great man',
                        article_id: 1,
                        body: 'I find this existence challenging',
                        topic: 'mitch',
                        created_at: '2020-07-09T20:11:00.000Z',
                        votes: 100,
                        article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
                      }
                    )
                })
        })
        it('status 404 responds with error message', () => {
            return request(app)
            .get('/api/articles/9999')
            .expect(404)
            .then(({body}) => {
                expect(body.msg).toBe('Article non existent')
            })
        })
        it('status 404 responds with error message', () => {
            return request(app)
            .get('/api/articles/astring')
            .expect(400)
            .then(({body}) => {
                expect(body.msg).toBe('Invalid input')
            })
        })
    })
    describe('GET /api/articles', () => {
        it('status 200, return with an array of articles, each with the correct properties and ordered by created_at in descending order', () => {
            return request(app)
                .get('/api/articles')
                .expect(200)
                .then(({ body }) => {
                    expect(body.articles).toBeInstanceOf(Array)
                    expect(body.articles).toBeSortedBy('created_at', { descending: true })
                    body.articles.forEach((article) => {
                        expect(article).toEqual(
                            expect.objectContaining({
                                author: expect.any(String),
                                title: expect.any(String),
                                article_id: expect.any(Number),
                                topic: expect.any(String),
                                created_at: expect.any(String),
                                votes: expect.any(Number),
                                article_img_url: expect.any(String),
                                comment_count: expect.any(String)
                            })
                        )
                    })
                })
        })
        // it('status 404, when no articles and respond with message No articles found', () => {
        //     return request(app)
        //         .get('/api/articles')
        //         .expect(404)
        //         .then(({body}) => {
        //             expect(body.msg).toBe('No articles found')
        //         })
        // })
    })
    
    describe.only('GET /api/articles/:article_id/comments', () => {
        it('return comments for a valid article_id', () => {
            return request(app)
                .get('/api/articles/1/comments')
                .expect(200)
                .then(({body}) => {
                    console.log(body)
                    expect(body.comments).toHaveLength(11)
                    body.comments.forEach((comment) => {
                        expect(comment).toEqual(
                            expect.objectContaining({
                            comment_id: expect.any(Number),
                            votes: expect.any(Number),
                            created_at: expect.any(String),
                            author: expect.any(String),
                            body: expect.any(String),
                            article_id: 1
                            })
                        )
                    })
                })
        })
        it('status 200 if the article_id has no comments', () => {
            return request(app)
                .get('/api/articles/2/comments')
                .expect(200)
                .then(({body}) => {
                    expect(body.msg).toBe('No comments found for this article')
                })
        })
        it('status 404 if the article_id is non existent', () => {
            return request(app)
                .get('/api/articles/9999/comments')
                .expect(404)
                .then(({body}) => {
                    expect(body.msg).toBe('Article non existent')
                })
        })
        it('status 400 for an invalid article_id', () => {
            return request(app)
            .get('/api/articles/invalid/comments')
            .expect(400)
            .then(({body}) => {
                expect(body.msg).toBe('Invalid input')
            })
        })
    })
})
