import {Endpoint} from "../endpoint.js";
import {param} from "express-validator";
import {Request, Response} from "express";
import prisma from "../../db/db.js";
import {Course} from "@prisma/client";
import {Message} from "../../types/errors.js";

export default class GetCoursesByYearEndpoint extends Endpoint {
    readonly path = "/courses/year/:year";

    readonly validators = [
        param('year').isInt()
    ];

    protected async _get(req: Request, res: Response<Course[] | Message>) {
        const year = parseInt(req.params.year);

        const schoolYear = await prisma.schoolYear.findUnique({
            where: {
                start_year: year
            }
        });

        if (!schoolYear) {
            await res.status(404).json({message: "School year not found"})
            return;
        }

        const courses = await prisma.course.findMany({
            where: {
                school_year_id: year
            }
        });

        await res.json(courses);
    }
}