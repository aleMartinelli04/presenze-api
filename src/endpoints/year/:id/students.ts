import {Endpoint} from "../../endpoint.js";
import {param} from "express-validator";
import e from "express";
import prisma from "../../../db/db.js";
import {PrismaClientKnownRequestError} from "@prisma/client/runtime/index.js";
import {errCodes} from "../../../utils/err-codes.js";

export default class StudentsForYear extends Endpoint {
    readonly path = "/year/:id/students";

    readonly validators = [
        param('id').isInt()
    ];

    protected async _get(req: e.Request, res: e.Response): Promise<any> {
        const id = parseInt(req.params.id);

        try {
            const year = await prisma.schoolYear.findUnique({
                where: {
                    start_year: id
                }
            });

            if (year === null) {
                await res.status(404).json({err: errCodes.ERR_YEAR_NOT_FOUND});
                return;
            }

            const students = await prisma.student.findMany({
                where: {
                    class: {
                        school_year: year
                    }
                },
                include: {
                    class: true
                }
            });

            await res.json(students);

        } catch (e: PrismaClientKnownRequestError | any) {
            await res.status(500).json({err: errCodes.ERR_UNKNOWN});
        }
    }
}