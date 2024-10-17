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
    describe.only('GET /api/articles/:article_id', () => {
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
                expect(body.msg).toBe('Invalid article id')
            })
        })
    })
})