import {Endpoint} from "../endpoint.js";
import {Request, Response} from "express";
import {SchoolYear} from "@prisma/client";
import prisma from "../../db/db.js";
import {Message} from "../../types/errors.js";
import {body} from "express-validator";

export default class CreateSchoolYearEndpoint extends Endpoint {
    readonly path: string = "/school-year/create";
    readonly validators: any[] = [
        body("start_year").isInt({min: 2000})
    ];

    protected async _post(req: Request, res: Response<SchoolYear | Message>): Promise<any> {
        const start_year = parseInt(req.body.start_year);

        const exists = await prisma.schoolYear.findFirst({
            where: {
                start_year: start_year
            }
        });

        if (exists) {
            await res.status(409).json({message: "School year already exists"});
            return;
        }

        let schoolYear: SchoolYear = await prisma.schoolYear.create({
            data: {
                start_year: start_year
            }
        });

        res.json(schoolYear);
    }
}