import {Endpoint} from "../endpoint.js";
import {param} from "express-validator";
import {SchoolYear} from "@prisma/client";
import {Request, Response} from "express";
import {Message} from "../../types/errors.js";
import prisma from "../../db/db.js";

export default class DeleteSchoolYearEndpoint extends Endpoint {
    readonly path: string = "/school-year/:start_year/delete";
    readonly validators: any[] = [
        param('start_year').isInt({min: 2000})
    ];

    protected async _delete(req: Request, res: Response<SchoolYear | Message>): Promise<any> {
        const startYear = parseInt(req.params.start_year);

        const schoolYear = await prisma.schoolYear.findUnique({
            where: {
                start_year: startYear
            }
        });

        if (!schoolYear) {
            await res.status(404).json({message: "School year not found"});
            return;
        }

        await prisma.schoolYear.delete({
            where: {
                start_year: startYear
            }
        });

        await res.json(schoolYear);
    }
}