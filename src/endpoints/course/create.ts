import {Endpoint} from "../endpoint.js";
import {body} from "express-validator";
import {Request, Response} from "express";
import prisma from "../../db/db.js";
import {Course} from "@prisma/client";
import {Message} from "../../types/errors.js";

export default class CreateCourseEndpoint extends Endpoint {
    readonly path = "/course/create";

    readonly validators = [
        body('name').isString(),
        body('school_year').isInt()
    ];

    protected async _post(req: Request, res: Response<Course | Message>) {
        const name = req.body.name;
        const schoolYear = parseInt(req.body.school_year);

        const year = await prisma.schoolYear.findUnique({
            where: {
                start_year: schoolYear
            }
        });

        if (!year) {
            await res.status(404).json({message: "School year not found"});
            return;
        }

        const course = await prisma.course.create({
            data: {
                name: name,
                school_year_id: schoolYear
            }
        });

        await res.json(course);
    }
}