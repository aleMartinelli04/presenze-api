import {Endpoint} from "../../endpoint.js";
import {body, param} from "express-validator";
import e from "express";
import prisma from "../../../db/db.js";
import {PrismaClientKnownRequestError} from "@prisma/client/runtime";
import {errCodes} from "../../../utils/err-codes.js";

export default class UpdateCourse extends Endpoint {
    readonly path = "/course/:id/update";

    readonly validators = [
        param('id').isInt(),
        body('name').optional().isString(),
        body('year').optional().isInt()
    ];

    protected async _put(req: e.Request, res: e.Response): Promise<any> {
        const id = parseInt(req.params.id);
        const {name, year} = req.body;

        try {
            const course = await prisma.course.update({
                where: {
                    id: id
                },
                data: {
                    name: name,
                    school_year_id: year
                }
            });

            await res.json(course);

        } catch (e: PrismaClientKnownRequestError | any) {
            if (e.code === 'P2025') {
                await res.status(404).json({err: errCodes.ERR_COURSE_NOT_FOUND});
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