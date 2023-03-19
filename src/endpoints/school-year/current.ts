import {Endpoint} from "../endpoint.js";
import {Request, Response} from "express";
import {SchoolYear} from "@prisma/client";
import {Message} from "../../types/errors.js";
import prisma from "../../db/db.js";

export default class CurrentYearEndpoint extends Endpoint {
    readonly path = "/current-school-year";

    readonly validators = [];

    protected async _get(req: Request, res: Response<SchoolYear | Message>): Promise<any> {
        const currentDate = new Date();

        let currentYear;

        if (currentDate.getMonth() < 9) {
            currentYear = currentDate.getFullYear() - 1;
        } else {
            currentYear = currentDate.getFullYear();
        }

        const year: SchoolYear | null = await prisma.schoolYear.findUnique({
            where: {
                start_year: currentYear
            }
        });

        if (!year) {
            await res.status(404).json({message: "School year does not exists"});
            return;
        }

        await res.json(year);
    }
}