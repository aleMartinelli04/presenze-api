import {Endpoint} from "../../endpoint.js";
import e from "express";
import prisma from "../../../db/db.js";
import {param} from "express-validator";
import {PrismaClientKnownRequestError} from "@prisma/client/runtime";
import {errCodes} from "../../../utils/err-codes.js";

export default class ClassesForYear extends Endpoint {
    readonly path = "/year/:id/classes";

    readonly validators = [
        param('id').isInt()
    ];

    protected async _get(req: e.Request, res: e.Response): Promise<any> {
        const id = parseInt(req.params.id);

        try {
            const classes = await prisma.schoolYear.findUnique({
                where: {
                    start_year: id
                }
            }).classes({
                orderBy: {
                    name: "asc"
                }
            });

            if (classes === null) {
                await res.status(404).json({err: errCodes.ERR_YEAR_NOT_FOUND});
                return;
            }

            await res.json(classes);

        } catch (e: PrismaClientKnownRequestError | any) {
            await res.status(500).json({err: errCodes.ERR_UNKNOWN});
        }
    }
}