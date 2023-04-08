import {Endpoint} from "../../endpoint.js";
import {body, param} from "express-validator";
import prisma from "../../../db/db.js";
import e from "express";
import {PrismaClientKnownRequestError} from "@prisma/client/runtime";
import {errCodes} from "../../../utils/err-codes.js";

export default class UpdateStudent extends Endpoint {
    readonly path = "/student/:id/update";

    readonly validators = [
        param('id').isInt(),
        body('surname').optional().isString(),
        body('name').optional().isString(),
        body('class').optional().isInt()
    ];

    protected async _put(req: e.Request, res: e.Response): Promise<any> {
        const id = parseInt(req.params.id);
        const {surname, name, class: class_id} = req.body;

        try {
            const student = await prisma.student.update({
                where: {
                    id: id
                },
                data: {
                    surname: surname,
                    name: name,
                    class_id: class_id
                }
            });

            await res.json(student);

        } catch (e: PrismaClientKnownRequestError | any) {
            if (e.code === 'P2025') {
                await res.status(404).json({err: errCodes.ERR_STUDENT_NOT_FOUND});
                return;
            }

            if (e.code === 'P2003') {
                await res.status(400).json({err: errCodes.ERR_CLASS_NOT_FOUND});
                return;
            }

            await res.status(500).json({err: errCodes.ERR_UNKNOWN});
        }
    }
}