import {Endpoint} from "../endpoint.js";
import {Request, Response} from "express";
import {SchoolYear} from "@prisma/client";
import prisma from "../../db/db.js";

export default class ListAllSchoolYearEndpoint extends Endpoint {
    readonly path = "/school-year/all";
    readonly validators = [];

    protected async _get(req: Request, res: Response<SchoolYear[]>): Promise<any> {
        let schoolYears: SchoolYear[] = await prisma.schoolYear.findMany({
            orderBy: {
                start_year: "asc"
            }
        });

        res.json(schoolYears);
    }
}