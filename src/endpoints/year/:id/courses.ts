import {Endpoint} from "../../endpoint.js";
import {param} from "express-validator";
import e from "express";
import prisma from "../../../db/db.js";
import {errCodes} from "../../../utils/err-codes.js";
import {PrismaClientKnownRequestError} from "@prisma/client/runtime";

export default class CoursesForYear extends Endpoint {
    readonly path = "/year/:id/courses";

    readonly validators = [
        param('id').isInt()
    ];

    protected async _get(req: e.Request, res: e.Response): Promise<any> {
        const id = parseInt(req.params.id);

        try {
            const courses = await prisma.schoolYear.findUnique({
                where: {
                    start_year: id
                }
            }).courses();

            if (courses === null) {
                await res.status(404).json({err: errCodes.ERR_YEAR_NOT_FOUND});
                return;
            }

            await res.json(courses);

        } catch (e: PrismaClientKnownRequestError | any) {
            await res.status(500).json({err: errCodes.ERR_UNKNOWN});
        }
    }
}