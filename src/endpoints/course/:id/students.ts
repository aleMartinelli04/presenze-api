import {Endpoint} from "../../endpoint.js";
import {param} from "express-validator";
import prisma from "../../../db/db.js";
import e from "express";
import {errCodes} from "../../../utils/err-codes.js";
import {PrismaClientKnownRequestError} from "@prisma/client/runtime";

export default class StudentsForCourse extends Endpoint {
    readonly path = "/course/:id/students";

    readonly validators = [
        param('id').isInt()
    ];

    protected async _get(req: e.Request, res: e.Response): Promise<any> {
        const id = parseInt(req.params.id);

        try {
            const students = await prisma.student.findMany({
                where: {
                    inscriptions: {
                        some: {
                            course_id: id
                        }
                    }
                }
            });

            await res.json(students);

        } catch (e: PrismaClientKnownRequestError | any) {
            if (e.code === 'P2025') {
                await res.status(400).json({err: errCodes.ERR_COURSE_NOT_FOUND});
                return;
            }

            await res.status(500).json({err: errCodes.ERR_UNKNOWN});
        }
    }
}