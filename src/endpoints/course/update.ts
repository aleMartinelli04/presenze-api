import {Endpoint} from "../endpoint.js";
import {body, param} from "express-validator";
import {Request, Response} from "express";
import prisma from "../../db/db.js";
import {Course} from "@prisma/client";
import {Message} from "../../types/errors.js";

export default class UpdateCourseEndpoint extends Endpoint {
    readonly path = "/course/:id/update";

    readonly validators = [
        param('id').isInt(),
        body('name').optional().isString(),
        body('school_year').optional().isInt()
    ];

    protected async _put(req: Request, res: Response<Course | Message>): Promise<any> {
        const courseId = parseInt(req.params.id);

        const name = req.body.name;
        const schoolYearId = req.body.school_year;

        const course = await prisma.course.findUnique({
            where: {
                id: courseId
            }
        });

        if (!course) {
            await res.status(404).json({message: "Course not found"});
            return;
        }

        try {
            const updatedCourse = await prisma.course.update({
                where: {
                    id: courseId
                },
                data: {
                    name: name,
                    school_year_id: schoolYearId
                }
            });

            await res.json(updatedCourse);

        } catch (err) {
            await res.status(404).json({message: "Invalid school year"});
        }
    }
}