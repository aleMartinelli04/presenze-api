import {Endpoint} from "../endpoint.js";
import {body, param} from "express-validator";
import {Request, Response} from "express";
import {Course, Student} from "@prisma/client";
import prisma from "../../db/db.js";

export default class UnsubscribeEndpoint extends Endpoint {
    readonly path = "/course/:id/unsubscribe";

    readonly validators = [
        param('id').isInt(),
        body('student').isInt()
    ];

    protected async _delete(req: Request, res: Response): Promise<any> {
        const courseId = parseInt(req.params.id);
        const studentId = req.body.student;

        const course: Course | null = await prisma.course.findUnique({
            where: {
                id: courseId
            }
        });

        if (!course) {
            await res.status(404).json({message: "Course not found"});
            return;
        }

        const student: Student | null = await prisma.student.findUnique({
            where: {
                id: studentId
            }
        });

        if (!student) {
            await res.status(404).json({message: "Student not found"});
            return;
        }

        await prisma.inscriptions.deleteMany({
            where: {
                course_id: courseId,
                student_id: studentId
            }
        });

        await res.json({message: "Student unsubscribed successfully"});
    }
}