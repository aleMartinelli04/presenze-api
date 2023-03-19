import {Endpoint} from "../endpoint.js";
import {param} from "express-validator";
import {Request, Response} from "express";
import {Course, Student} from "@prisma/client";
import {Message} from "../../types/errors.js";
import prisma from "../../db/db.js";

export default class GetStudentsForCourseEndpoint extends Endpoint {
    readonly path = "/course/:id/students"

    readonly validators = [
        param('id').isInt()
    ];

    protected async _get(req: Request, res: Response<Student[] | Message>): Promise<any> {
        const id = parseInt(req.params.id);

        const course: Course | null = await prisma.course.findUnique({
            where: {
                id: id
            }
        });

        if (!course) {
            await res.status(404).json({message: "Course not found"});
            return;
        }

        const students = await prisma.student.findMany({
            where: {
                inscriptions: {
                    some: {
                        course_id: id
                    }
                }
            }
        });

        await res.json(students);
    }
}