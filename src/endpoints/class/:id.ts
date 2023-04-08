import {Endpoint} from "../endpoint.js";
import e from "express";
import prisma from "../../db/db.js";
import {param} from "express-validator";
import {errCodes} from "../../utils/err-codes.js";

export default class Class extends Endpoint {
    readonly path = "/class/:id";

    readonly validators = [
        param('id').isInt()
    ];

    protected async _get(req: e.Request, res: e.Response): Promise<any> {
        const id = parseInt(req.params.id);

        const c = await prisma.class.findUnique({
            where: {
                id: id
            }
        });

        if (!c) {
            await res.status(404).json({err: errCodes.ERR_CLASS_NOT_FOUND});
            return;
        }

        await res.json(c);
    }
}