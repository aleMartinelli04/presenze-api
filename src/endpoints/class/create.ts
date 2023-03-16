import {Endpoint} from "../endpoint.js";
import {Request, Response} from "express";
import {body} from "express-validator";
import {Class, SchoolYear} from "@prisma/client";
import {Message} from "../../types/errors.js";
import prisma from "../../db/db.js";

export default class CreateClassEndpoint extends Endpoint {
    readonly path = "/class/create";
    readonly validators = [
        body("name").isString(),
        body("start_year").isInt({min: 0})
    ];

    protected async _post(req: Request, res: Response<Class | Message>): Promise<any> {
        const name = req.body.name;
        const start_year = parseInt(req.body.start_year);

        const schoolYear: SchoolYear | null = await prisma.schoolYear.findUnique({
            where: {
                start_year: start_year
            }
        });

        if (!schoolYear) {
            await res.status(404).json({message: "School Year not found"});
            return;
        }

        const createdClass = await prisma.class.create({
            data: {
                name: name,
                school_year_id: start_year
            }
        });

        await res.status(200).json(createdClass);
    }
}