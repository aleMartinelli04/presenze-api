import {Endpoint} from "../endpoint.js";
import {body, param} from "express-validator";
import {Request, Response} from "express";
import {Class, Course, Student} from "@prisma/client";
import prisma from "../../db/db.js";
import {Message} from "../../types/errors.js";
import {PrismaClientKnownRequestError} from "@prisma/client/runtime";

export default class InscribeStudentsEndpoint extends Endpoint {
    readonly path = "/course/:id/inscribe";

    readonly validators = [
        param('id').isInt(),
        body('student').isInt()
    ]

    protected async _post(req: Request, res: Response<Message>): Promise<any> {
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

        const studentClass: Class | null = await prisma.class.findUnique({
            where: {
                id: student.class_id
            }
        });

        if (!studentClass) {
            await res.status(500).json({message: "Student not inscribed (unknown error)"});
            return;
        }

        if (studentClass.school_year_id !== course.school_year_id) {
            await res.status(500).json({message: "Student and course have a different year"});
            return;
        }

        try {
            await prisma.inscriptions.create({
                data: {
                    course_id: courseId,
                    student_id: studentId
                }
            });

            await res.json({message: "Student inscribed successfully"});
        } catch (err) {
            const e = err as PrismaClientKnownRequestError;

            if (e.code == "P2002") {
                await res.status(500).json({message: "Student already inscribed"});
                return;
            }

            await res.status(500).json({message: "Student not inscribed (unknown error)"});
        }
    }
}