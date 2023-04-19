import express, {Request, Response} from 'express'
import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery} from "./types";
import {CreateCourseModel} from "./models/CreateCourseModel";
import {UpdateCourseModel} from "./models/UpdateCourseModel";
import {QueryCoursesModel} from "./models/QueryCoursesModel";
import {CourseViewModel} from "./models/CourseViewModel";
import {URIParamsCourseIdModel} from "./models/URIParamsCourseIdModel";

export const app  = express()
const port = 3000

export const HTTP_STATUS = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,

    BAD_REQUEST_400: 400,
    NOT_FOUND_404: 404
}

const jsonBodyMiddleware = express.json()
app.use(jsonBodyMiddleware)

type CourseType = {
    id: number
    title: string
    studentsCount: number
}

const db: {courses: CourseType[]} = {
    courses: [
        {id: 1, title: 'front-end', studentsCount: 10},
        {id: 2, title: 'back-end', studentsCount: 10},
        {id: 3, title: 'automation qa', studentsCount: 10},
        {id: 4, title: 'devops', studentsCount: 10}
    ]
}

const getCourseViewModel = (dbCourse: CourseType): CourseViewModel => {
    return  {
        id: dbCourse.id,
        title: dbCourse.title
    }
}

app.get('/courses', (req: RequestWithQuery<QueryCoursesModel>,
                     res: Response<CourseViewModel[]>) => {
    let foundCourses = db.courses;

    if(req.query.title) {
    foundCourses = foundCourses
        .filter(c => c.title.indexOf(req.query.title) > -1)
    }

    res.json(foundCourses.map(getCourseViewModel))
})
app.get('/courses/:id', (req: RequestWithParams<URIParamsCourseIdModel>,
                         res: Response<CourseViewModel>) => {
    const foundCourse = db.courses.find(c => c.id === +req.params.id)

    if(!foundCourse) {
        res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
        return;
    }

    res.json(getCourseViewModel(foundCourse))
})
app.post('/courses', (req: RequestWithBody<CreateCourseModel>,
                      res: Response<CourseViewModel>) => {
    if(!req.body.title) {
        res.sendStatus(HTTP_STATUS.BAD_REQUEST_400)
        return;
    }

    const createdCourse: CourseType = {
        id: +(new Date()),
        title: req.body.title,
        studentsCount: 0
    }
    db.courses.push(createdCourse)

    res
        .status(HTTP_STATUS.CREATED_201)
        .json(getCourseViewModel(createdCourse))
})
app.delete('/courses/:id', (req: RequestWithParams<{id: string}>, res) => {
    db.courses = db.courses.filter(c => c.id !== +req.params.id)

    res.sendStatus(204)
})
app.put('/courses/:id', (req: RequestWithParamsAndBody<URIParamsCourseIdModel,
                            UpdateCourseModel>,
                         res) => {
    if(!req.body.title) {
        res.sendStatus(HTTP_STATUS.BAD_REQUEST_400);
        return;
    }

    const foundCourse = db.courses.find(c => c.id === +req.params.id)
    if(!foundCourse) {
        res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
        return;
    }

    foundCourse.title = req.body.title;

    res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
})

app.delete('/__test__/data', (req, res) => {
    db.courses = [];
    res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
