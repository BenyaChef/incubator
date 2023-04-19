import request from 'supertest'
import {app, HTTP_STATUS} from "../../src";

describe('/course', () => {
    beforeAll(async () => {
        await request(app).delete('/__test__/data')
    })

    it('should return 200 and empty array', async () => {
       await request(app)
            .get('/courses')
            .expect(HTTP_STATUS.OK_200, [])
    })

    it('should return 404 for not existing course', async () => {
        await request(app)
            .get('/courses/1')
            .expect(HTTP_STATUS.NOT_FOUND_404)
    })

    it('should`nt create course with incorrect input data', async () => {

        await request(app)
            .post('/courses')
            .send({title: ''})
            .expect(HTTP_STATUS.BAD_REQUEST_400);

        await request(app)
            .get('/courses')
            .expect(HTTP_STATUS.OK_200, [])
    })
    let createdCourse1: any = null;
    it('should create course with correct input data', async () => {

        const createResponse = await request(app)
            .post('/courses/')
            .send({title: 'it-incubator course 1'})
            .expect(HTTP_STATUS.CREATED_201);

        createdCourse1 = createResponse.body;

        expect(createdCourse1).toEqual({
            id: expect.any(Number),
            title: 'it-incubator course 1'
        })

        await request(app)
            .get('/courses')
            .expect(HTTP_STATUS.OK_200, [createdCourse1])
    })
    let createdCourse2: any = null;
    it('create one more course', async () => {
        const createResponse = await request(app)
            .post('/courses')
            .send({title: 'it-incubator course 2'})
            .expect(HTTP_STATUS.CREATED_201)
        createdCourse2 =createResponse.body;

        expect(createdCourse2).toEqual({
            id: expect.any(Number),
            title: 'it-incubator course 2'
        })

        await request(app)
            .get('/courses')
            .expect(HTTP_STATUS.OK_200, [createdCourse1, createdCourse2])
    })
    it('should`nt update course with incorrect data', async () => {
        await request(app)
            .put('/courses/' + createdCourse1.id)
            .send({title: ''})
            .expect(HTTP_STATUS.BAD_REQUEST_400);

        await request(app)
            .get('/courses/' + createdCourse1.id)
            .expect(HTTP_STATUS.OK_200, createdCourse1)
    })

    it('should`nt update course that not exist', async () => {
        await request(app)
            .put('/courses/' + -100)
            .send({title: 'good title'})
            .expect(HTTP_STATUS.NOT_FOUND_404);
    })

    it('should update course with correct input data', async () => {
        await request(app)
            .put('/courses/' + createdCourse1.id)
            .send({title: 'good new title'})
            .expect(HTTP_STATUS.NO_CONTENT_204);

        await request(app)
            .get('/courses/' + createdCourse1.id)
            .expect(HTTP_STATUS.OK_200, {
                ...createdCourse1,
                title: 'good new title'
            })

        await request(app)
            .get('/courses/' + createdCourse2.id)
            .expect(HTTP_STATUS.OK_200, createdCourse2)
    })

    it('should delete both course', async () => {
        await request(app)
            .delete('/courses/' + createdCourse1.id)
            .expect(HTTP_STATUS.NO_CONTENT_204)

        await request(app)
            .get('/courses/' + createdCourse1.id)
            .expect(HTTP_STATUS.NOT_FOUND_404)

        await request(app)
            .delete('/courses/' + createdCourse2.id)
            .expect(HTTP_STATUS.NO_CONTENT_204)

        await request(app)
            .get('/courses/' + createdCourse2.id)
            .expect(HTTP_STATUS.NOT_FOUND_404)

        await request(app)
            .get('/courses')
            .expect(HTTP_STATUS.OK_200, [])
    })
})