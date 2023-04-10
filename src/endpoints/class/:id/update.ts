import {Endpoint} from "../../endpoint.js";
import {body, param} from "express-validator";
import prisma from "../../../db/db.js";
import e from "express";
import {PrismaClientKnownRequestError} from "@prisma/client/runtime";
import {errCodes} from "../../../utils/err-codes.js";

export default class UpdateClass extends Endpoint {
    readonly path = "/class/:id/update";

    readonly validators = [
        param('id').isInt(),
        body('name').optional().isString(),
        body('year').optional().isInt()
    ];

    protected async _put(req: e.Request, res: e.Response): Promise<any> {
        const id = parseInt(req.params.id);
        const {name, year} = req.body;

        try {
            const c = await prisma.class.update({
                where: {
                    id: id
                },
                data: {
                    name: name,
                    school_year_id: year
                }
            });

            await res.json(c);

        } catch (e: PrismaClientKnownRequestError | any) {
            if (e.code === 'P2025') {
                await res.status(404).json({err: errCodes.ERR_CLASS_NOT_FOUND});
                return;
            }

            if (e.code === 'P2003') {
                await res.status(400).json({err: errCodes.ERR_YEAR_NOT_FOUND});
                return;
            }

            await res.status(500).json({err: errCodes.ERR_UNKNOWN});
        }
    }
}