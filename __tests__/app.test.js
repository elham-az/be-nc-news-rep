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
        it('return article object for a valid id with comment_count', () => {
            return request(app)
                .get('/api/articles/1')
                .expect(200)
                .then(({body}) => {
                    expect(body.article).toEqual(
                        expect.objectContaining({
                            author: 'butter_bridge',
                            title: 'Living in the shadow of a great man',
                            article_id: 1,
                            body: 'I find this existence challenging',
                            topic: 'mitch',
                            created_at: '2020-07-09T20:11:00.000Z',
                            votes: 100,
                            article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
                            comment_count: '11'
                        })
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
    describe('GET /api/articles/:article_id/comments', () => {
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
    describe('POST /api/articles/:article_id/comments', () => {
        it('returns 201 and adds a comment and responds with the new comment', () => {
            const newComment = { username: 'icellusedkars', body: 'Great article!' }
            return request(app)
                .post('/api/articles/1/comments')  
                .send(newComment)
                .expect(201)
                .then(({ body }) => {
                    const { comment } = body;
                    expect(comment).toEqual(
                        expect.objectContaining({
                            comment_id: expect.any(Number),
                            article_id: 1,
                            author: 'icellusedkars',
                            body: 'Great article!',
                            created_at: expect.any(String)
                        })
                    )
                })
        })
        it('returns 400 and responds with an error when required fields are missing', () => {
            const incompleteComment = { body: 'Missing username' }
            return request(app)
                .post('/api/articles/1/comments')
                .send(incompleteComment)
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe('Missing required fields: username and/or body')
                })
        })
        it('returns 404 and responds with an error for non-existent article_id', () => {
            const newComment = { username: 'icellusedkars', body: 'Comment text' }
            return request(app)
                .post('/api/articles/9999/comments') 
                .send(newComment)
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe('Article or user not found')
                })
        })
        it('retusn 404 and responds with an error for non-existent username', () => {
            const newComment = { username: 'nonExistentUser', body: 'Comment text' }
            return request(app)
                .post('/api/articles/1/comments') 
                .send(newComment)
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe('Article or user not found')
                })
        })
    })
    describe('PATCH /api/articles/:article_id', () => {
        it('should successfully update the article votes and return the updated article', () => {
            return request(app)
                .patch('/api/articles/1')
                .send({ inc_votes: 1 })
                .expect(200)
                .then(({ body }) => {
                    expect(body.article).toHaveProperty('article_id', 1)
                    expect(body.article).toHaveProperty('votes', expect.any(Number))
                })
        })
        it('should return 400 if inc_votes is missing in the request body', () => {
            return request(app)
                .patch('/api/articles/1')
                .send({})
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe("Missing required field: inc_votes")
                })
        })
        it('should return 400 if article_id format is invalid', () => {
            return request(app)
                .patch('/api/articles/not-a-number')
                .send({ inc_votes: 1 })
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe("Invalid article_id format")
                })
        })
        it('should return 404 if article is not found', () => {
            return request(app)
                .patch('/api/articles/9999') 
                .send({ inc_votes: 1 })
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe("Article not found")
                })
        })
    })
    describe('GET /api/users', () => {
        it('should return an array of users with username, name, and avatar_url properties. 200', () => {
            return request(app)
                .get('/api/users')
                .expect(200)
                .then(({ body }) => {
                    expect(body.users).toBeInstanceOf(Array)
                    body.users.forEach((user) => {
                        expect(user).toEqual(
                            expect.objectContaining({
                                username: expect.any(String),
                                name: expect.any(String),
                                avatar_url: expect.any(String)
                            })
                        )
                    })
                })
        })
        it('should return 404 if endpoint is not found. 404', () => {
            return request(app)
                .get('/api/nonexistent')
                .expect(404)
        })
    })
    describe('GET /api/articles (with sorting)', () => {
        it('returns articles sorted by created_at in descending order by default. 200', () => {
            return request(app)
                .get('/api/articles')
                .expect(200)
                .then(({ body }) => {
                    expect(body.articles).toBeInstanceOf(Array)
                    expect(body.articles).toBeSortedBy('created_at', { descending: true })
                })
        })
        it('returns articles sorted by title in ascending order. 200', () => {
            return request(app)
                .get('/api/articles?sort_by=title&order=asc')
                .expect(200)
                .then(({ body }) => {
                    expect(body.articles).toBeInstanceOf(Array)
                    expect(body.articles).toBeSortedBy('title', { ascending: true })
                })
        })
        it('returns articles sorted by votes in descending order. 200', () => {
            return request(app)
                .get('/api/articles?sort_by=votes&order=desc')
                .expect(200)
                .then(({ body }) => {
                    expect(body.articles).toBeInstanceOf(Array)
                    expect(body.articles).toBeSortedBy('votes', { descending: true })
                })
        })
        it('returns a 400 error for an invalid sort_by column.', () => {
            return request(app)
                .get('/api/articles?sort_by=invalid_column')
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe("Invalid 'sort_by' column. Must be one of: author, title, article_id, topic, created_at, votes, comment_count")
                })
        })
        it('returns a 400 error for an invalid order value', () => {
            return request(app)
                .get('/api/articles?sort_by=title&order=invalid_order')
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe("Invalid 'order' value. Must be 'asc' or 'desc'.")
                })
        })
    })
    describe("GET /api/articles (with topic filtering and sorting)", () => {
        it("returns all articles sorted by created_at in descending order by default. 200", () => {
            return request(app)
                .get("/api/articles")
                .expect(200)
                .then(({ body }) => {
                    expect(body.articles).toBeInstanceOf(Array)
                    expect(body.articles).toBeSortedBy("created_at", { descending: true })
                })
        })
        it("returns articles filtered by topic and sorted by title in ascending order. 200", () => {
            return request(app)
                .get("/api/articles?topic=mitch&sort_by=title&order=asc")
                .expect(200)
                .then(({ body }) => {
                    expect(body.articles).toBeInstanceOf(Array)
                    body.articles.forEach(article => {
                        expect(article.topic).toBe("mitch")
                    });
                    expect(body.articles).toBeSortedBy("title", { ascending: true })
                })
        })
        it("returns a 404 error when no articles match the specified topic", () => {
            return request(app)
                .get("/api/articles?topic=nonexistent")
                .expect(404)
                .then(({ body }) => {
                    expect(body.error).toBe("No articles found for the specified topic.")
                })
        })
    })
})
