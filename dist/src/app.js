"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCourseViewModel = exports.db = exports.jsonBodyMiddleware = exports.HTTP_STATUS = exports.app = void 0;
const express_1 = __importDefault(require("express"));
exports.app = (0, express_1.default)();
exports.HTTP_STATUS = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,
    BAD_REQUEST_400: 400,
    NOT_FOUND_404: 404
};
exports.jsonBodyMiddleware = express_1.default.json();
exports.db = {
    courses: [
        { id: 1, title: 'front-end', studentsCount: 10 },
        { id: 2, title: 'back-end', studentsCount: 10 },
        { id: 3, title: 'automation qa', studentsCount: 10 },
        { id: 4, title: 'devops', studentsCount: 10 }
    ]
};
const getCourseViewModel = (dbCourse) => {
    return {
        id: dbCourse.id,
        title: dbCourse.title
    };
};
exports.getCourseViewModel = getCourseViewModel;
exports.app.use(exports.jsonBodyMiddleware);
exports.app.get('/courses', (req, res) => {
    let foundCourses = exports.db.courses;
    if (req.query.title) {
        foundCourses = foundCourses
            .filter(c => c.title.indexOf(req.query.title) > -1);
    }
    res.json(foundCourses.map(exports.getCourseViewModel));
});
exports.app.get('/courses/:id', (req, res) => {
    const foundCourse = exports.db.courses.find(c => c.id === +req.params.id);
    if (!foundCourse) {
        res.sendStatus(exports.HTTP_STATUS.NOT_FOUND_404);
        return;
    }
    res.json((0, exports.getCourseViewModel)(foundCourse));
});
exports.app.post('/courses', (req, res) => {
    if (!req.body.title) {
        res.sendStatus(exports.HTTP_STATUS.BAD_REQUEST_400);
        return;
    }
    const createdCourse = {
        id: +(new Date()),
        title: req.body.title,
        studentsCount: 0
    };
    exports.db.courses.push(createdCourse);
    res
        .status(exports.HTTP_STATUS.CREATED_201)
        .json((0, exports.getCourseViewModel)(createdCourse));
});
exports.app.delete('/courses/:id', (req, res) => {
    exports.db.courses = exports.db.courses.filter(c => c.id !== +req.params.id);
    res.sendStatus(204);
});
exports.app.put('/courses/:id', (req, res) => {
    if (!req.body.title) {
        res.sendStatus(exports.HTTP_STATUS.BAD_REQUEST_400);
        return;
    }
    const foundCourse = exports.db.courses.find(c => c.id === +req.params.id);
    if (!foundCourse) {
        res.sendStatus(exports.HTTP_STATUS.NOT_FOUND_404);
        return;
    }
    foundCourse.title = req.body.title;
    res.sendStatus(exports.HTTP_STATUS.NO_CONTENT_204);
});
exports.app.delete('/__test__/data', (req, res) => {
    exports.db.courses = [];
    res.sendStatus(exports.HTTP_STATUS.NO_CONTENT_204);
});
