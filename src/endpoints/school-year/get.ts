import {Endpoint} from "../endpoint.js";
import {Request, Response} from "express";
import {param} from "express-validator";
import {SchoolYear} from "@prisma/client";
import {Message} from "../../types/errors.js";
import prisma from "../../db/db.js";

export default class GetClassEndpoint extends Endpoint {
    readonly path: string = "/school-year/get/:start_year"
    readonly validators: any[] = [
        param("start_year").isInt({min: 0})
    ];

    protected async _get(req: Request, res: Response<SchoolYear | Message>): Promise<any> {
        const start_year = parseInt(req.params.start_year);

        const schoolYear: SchoolYear | null = await prisma.schoolYear.findUnique({
            where: {
                start_year: start_year
            }
        });

        if (!schoolYear) {
            await res.json({message: "School year not found"});
            return;
        }

        await res.json(schoolYear);
    }
}