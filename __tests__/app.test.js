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
    describe.only('GET /api', () => {
        test('Return a object with all the endpoints', () => {
            return request(app)
            .get('/api')
            .expect(200)
            .then(({body}) => {
                console.log(body)
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
})