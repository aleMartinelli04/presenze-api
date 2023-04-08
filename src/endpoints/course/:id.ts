import {Endpoint} from "../endpoint.js";
import {param} from "express-validator";
import prisma from "../../db/db.js";
import e from "express";
import {errCodes} from "../../utils/err-codes.js";

export default class Course extends Endpoint {
    readonly path = "/course/:id";

    readonly validators = [
        param('id').isInt()
    ];

    protected async _get(req: e.Request, res: e.Response): Promise<any> {
        const id = parseInt(req.params.id);

        const course = await prisma.course.findUnique({
            where: {
                id: id
            }
        });

        if (!course) {
            return res.status(404).json({err: errCodes.ERR_COURSE_NOT_FOUND});
        }

        res.json(course);
    }
}