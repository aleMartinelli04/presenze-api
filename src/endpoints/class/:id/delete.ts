import {Endpoint} from "../../endpoint.js";
import {param} from "express-validator";
import prisma from "../../../db/db.js";
import e from "express";
import {errCodes} from "../../../utils/err-codes.js";

export default class DeleteClass extends Endpoint {
    readonly path = "/class/:id/delete";

    readonly validators = [
        param('id').isInt()
    ];

    protected async _delete(req: e.Request, res: e.Response): Promise<any> {
        const id = parseInt(req.params.id);

        try {
            const deletedClass = await prisma.class.delete({
                where: {
                    id: id
                }
            });

            res.json(deletedClass);

        } catch (e) {
            res.status(500).json({err: errCodes.ERR_CLASS_NOT_FOUND});
        }
    }
}