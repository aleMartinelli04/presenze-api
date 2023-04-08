import {Endpoint} from "../../endpoint.js";
import {param} from "express-validator";
import e from "express";
import prisma from "../../../db/db.js";
import {errCodes} from "../../../utils/err-codes.js";
import {PrismaClientKnownRequestError} from "@prisma/client/runtime";

export default class StudentsForClass extends Endpoint {
    readonly path = "/class/:id/students";

    readonly validators = [
        param('id').isInt()
    ];

    protected async _get(req: e.Request, res: e.Response): Promise<any> {
        const id = parseInt(req.params.id);

        try {
            const students = await prisma.student.findMany({
                where: {
                    class: {
                        id: id
                    }
                }
            });

            res.json(students);

        } catch (e: PrismaClientKnownRequestError | any) {
            if (e.code == 'P2025') {
                await res.status(404).json({err: errCodes.ERR_CLASS_NOT_FOUND});
                return;
            }

            await res.status(500).json({err: errCodes.ERR_UNKNOWN});
        }
    }
}