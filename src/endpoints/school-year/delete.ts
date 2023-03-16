import {Endpoint} from "../endpoint.js";
import {param} from "express-validator";
import prisma from "../../db/db.js";
import {SchoolYear} from "@prisma/client";
import {Request, Response} from "express";
import {Message} from "../../types/errors.js";

export default class DeleteSchoolYearEndpoint extends Endpoint {
    readonly path: string = "/school-year/delete/:id";
    readonly validators: any[] = [
        param('id').isInt({min: 1})
    ];

    protected async _delete(req: Request, res: Response<SchoolYear | Message>): Promise<any> {
        try {
            const start_year = parseInt(req.params.id);

            let schoolYear: SchoolYear = await prisma.schoolYear.delete({
                where: {
                    start_year: start_year
                }
            });

            res.json(schoolYear);

        } catch (e) {
            res.json({message: "Could not delete school year"});
        }
    }
}