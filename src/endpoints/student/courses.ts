import {Endpoint} from "../endpoint.js";
import {param} from "express-validator";
import {Request, Response} from "express";
import prisma from "../../db/db.js";
import {Course, Student} from "@prisma/client";
import {Message} from "../../types/errors.js";

export default class StudentCoursesEndpoint extends Endpoint {
    readonly path = "/student/:id/courses";

    readonly validators = [
        param('id').isInt()
    ];

    protected async _get(req: Request, res: Response<Course[] | Message>): Promise<any> {
        const id = parseInt(req.params.id);

        const student: Student | null = await prisma.student.findUnique({
            where: {
                id: id
            }
        });

        if (!student) {
            await res.status(404).json({message: "Student not found"});
            return;
        }

        const courses = await prisma.course.findMany({
            where: {
                inscriptions: {
                    some: {
                        student_id: id
                    }
                }
            }
        });

        await res.json(courses);
    }
}