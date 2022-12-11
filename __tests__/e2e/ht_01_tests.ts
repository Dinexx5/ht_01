import request from 'supertest'
import {app} from "../../src";

describe('/videos', () => {
    beforeAll(async () => {
        await request(app).delete('/testing/all-data')
    })

    it('should return 200 and empty array', async () => {
         await request(app)
            .get('/videos')
            .expect (200, [])
    })

    it('should return 404 for not existing video', async () => {
        await request(app)
            .get('/videos/100')
            .expect (404)
    })

    it('should not create video with incorrect title', async () => {
        await request(app)
            .post('/videos')
            .send({
                title: '',
                author: 'jason stathem',
                availableResolutions: ['P144']
            })
            .expect (400)
    })

    it('should return 200 and empty array', async () => {
        await request(app)
            .get('/videos')
            .expect (200, [])
    })

    let createdVideo: any = null

    it('should create video with all correct input and push it', async () => {
        const expectedResponse = await request(app)
            .post('/videos')
            .send({
                title: 'title',
                author: 'jason stathem',
                availableResolutions: ['P144']
            })
            .expect (201)
        createdVideo = expectedResponse.body;
        expect(createdVideo).toEqual({
            id: expect.any(Number),
            title: "title",
            author: "jason stathem",
            canBeDownloaded: false,
            minAgeRestriction: null,
            createdAt: expect.any(String),
            publicationDate: expect.any(String),
            availableResolutions: ['P144'],
        })
        await request(app)
            .get('/videos')
            .expect (200, [createdVideo])
    })

    let createdVideo2: any = null

    it('should create 2nd video with all correct input and push it', async () => {
        const expectedResponse = await request(app)
            .post('/videos')
            .send({
                title: 'title 2',
                author: 'jason stathem',
                availableResolutions: ['P144']
            })
            .expect (201)
        createdVideo2 = expectedResponse.body;
        expect(createdVideo2).toEqual({
            id: expect.any(Number),
            title: "title 2",
            author: "jason stathem",
            canBeDownloaded: false,
            minAgeRestriction: null,
            createdAt: expect.any(String),
            publicationDate: expect.any(String),
            availableResolutions: ['P144'],
        })
        await request(app)
            .get('/videos')
            .expect (200, [createdVideo, createdVideo2])
    })

    it('should not update video with incorrect data', async () => {
        await request(app)
            .put('/videos/' + createdVideo.id)
            .send({
                title: "5456",
                author: 'jason stathem',
                availableResolutions: ['P144', 'P240'],
                canBeDownloaded: true,
                minAgeRestriction: 20,
                publicationDate: "gfdgfdgd",
            })
            .expect (400)

        await request(app)
            .get('/videos/' + createdVideo.id)
            .expect (createdVideo)
    })

    it('should not update video that do not exist', async () => {
        await request(app)
            .put('/videos/10000')
            .send({
                title: "title",
                author: 'jason stathem',
                availableResolutions: ['P144'],
                canBeDownloaded: true
            })
            .expect (404)

        await request(app)
            .get('/videos/' + createdVideo.id)
            .expect (createdVideo)
    })

    it('should update video with correct input data', async () => {
        await request(app)
            .put('/videos/' + createdVideo.id)
            .send({
                title: "newTitle",
                author: 'jason stathem',
                availableResolutions: ['P144','P240']
            })
            .expect (204)

        await request(app)
            .get('/videos/' + createdVideo.id)
            .expect ({...createdVideo, title: "newTitle", availableResolutions: ['P144','P240']})

        await request(app)
            .get('/videos/' + createdVideo2.id)
            .expect (createdVideo2)
    })

    it('should delete video with correct id', async () => {
        await request(app)
            .delete('/videos/' + createdVideo.id)
            .expect (204)

        await request(app)
            .get('/videos/' + createdVideo.id)
            .expect (404)

        await request(app)
            .get('/videos')
            .expect ([createdVideo2])
    })


})