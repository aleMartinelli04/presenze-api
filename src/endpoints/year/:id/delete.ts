import {Endpoint} from "../../endpoint.js";
import {param} from "express-validator";
import prisma from "../../../db/db.js";
import e from "express";
import {PrismaClientKnownRequestError} from "@prisma/client/runtime/index.js";
import {errCodes} from "../../../utils/err-codes.js";

export default class DeleteStudent extends Endpoint {
    readonly path = "/year/:id/delete";

    readonly validators = [
        param('id').isInt()
    ];

    protected async _delete(req: e.Request, res: e.Response): Promise<any> {
        const id = parseInt(req.params.id);

        try {
            const year = await prisma.schoolYear.delete({
                where: {
                    start_year: id
                }
            });

            await res.json(year);

        } catch (e: PrismaClientKnownRequestError | any) {
            if (e.code === 'P2025') {
                await res.status(404).json({err: errCodes.ERR_YEAR_NOT_FOUND});
                return;
            }

            await res.status(500).json({err: errCodes.ERR_UNKNOWN});
        }
    }
}