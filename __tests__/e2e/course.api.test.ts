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



    it('should`nt create course with incorrect input data', async () => {

        await request(app)
            .put('/courses/' + createCourse.id)
            .send({title: ''})
            .expect(HTTP_STATUS.BAD_REQUEST_400);


        await request(app)
            .get('/courses/' + createCourse.id)
            .expect(HTTP_STATUS.OK_200, createCourse)
    })

    it('should`nt update course that not exist', async () => {

        await request(app)
            .put('/courses/' + -100)
            .send({title: 'good title'})
            .expect(HTTP_STATUS.NOT_FOUND_404);
    })

    it('should update course with correct input data', async () => {

        await request(app)
            .put('/courses/' + createCourse.id)
            .send({title: 'good new title'})
            .expect(HTTP_STATUS.NO_CONTENT_204);

        await request(app)
            .get('/courses/' + createCourse.id)
            .expect(HTTP_STATUS.OK_200, {
                ...createCourse,
                title: 'good new title'
            })
    })

    let createCourse: any = null;
    it('should create course with correct input data', async () => {

        const createResponse = await request(app)
            .post('/courses')
            .send({title: 'it-incubator course'})
            .expect(HTTP_STATUS.CREATED_201);

        createCourse = createResponse.body;

        expect(createCourse).toEqual({
            id: expect.any(Number),
            title: 'it-incubator course'
        })
        await request(app)
            .get('/courses')
            .expect(HTTP_STATUS.OK_200, [createCourse])
    })


})