import {Endpoint} from "../../endpoint.js";
import e from "express";
import prisma from "../../../db/db.js";
import {param} from "express-validator";
import {errCodes} from "../../../utils/err-codes.js";
import {PrismaClientKnownRequestError} from "@prisma/client/runtime/index.js";

export default class DeleteCourse extends Endpoint {
    readonly path = "/course/:id/delete";

    readonly validators = [
        param('id').isInt()
    ];

    protected async _delete(req: e.Request, res: e.Response): Promise<any> {
        const id = parseInt(req.params.id);

        try {
            const course = await prisma.course.delete({
                where: {
                    id: id
                }
            });

            res.json(course);

        } catch (e: PrismaClientKnownRequestError | any) {
            if (e.code === 'P2025') {
                await res.status(400).json({err: errCodes.ERR_COURSE_NOT_FOUND});
                return;
            }

            await res.status(500).json({err: errCodes.ERR_UNKNOWN});
        }
    }
}