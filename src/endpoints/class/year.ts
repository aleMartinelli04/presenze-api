import {Endpoint} from "../endpoint.js";
import {param} from "express-validator";
import {Request, Response} from "express";
import prisma from "../../db/db.js";
import {Class} from "@prisma/client";
import {Message} from "../../types/errors.js";

export default class GetClassesForYearEndpoint extends Endpoint {
    readonly path = "/classes/year/:start_year";
    readonly validators = [
        param('start_year').isInt({min: 2000})
    ];

    protected async _get(req: Request, res: Response<Class[] | Message>): Promise<any> {
        const start_year = parseInt(req.params.start_year);

        const yearExists = await prisma.schoolYear.findUnique({
            where: {
                start_year: start_year
            }
        });

        if (!yearExists) {
            await res.status(404).send({message: "Year does not exists"});
            return;
        }

        const classes = await prisma.class.findMany({
            where: {
                school_year_id: start_year
            },
            orderBy: {
                school_year_id: "asc"
            }
        });

        await res.json(classes);
    }
}