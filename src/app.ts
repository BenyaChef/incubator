import express, {Response} from "express";
import {getCoursesRouter, getInterestingRouter} from "./routes/courses";
import {getTestsRouter} from "./routes/tests";
import {db} from "./db/db";

export const app = express()

export const jsonBodyMiddleware = express.json()

app.use(jsonBodyMiddleware)

app.use('/courses', getCoursesRouter(db))
app.use('/__test__', getTestsRouter(db))
app.use('/interesting', getInterestingRouter(db))