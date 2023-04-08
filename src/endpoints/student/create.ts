import {Endpoint} from "../endpoint.js";
import e from "express";
import prisma from "../../db/db.js";
import {body} from "express-validator";
import {PrismaClientKnownRequestError} from "@prisma/client/runtime";
import {errCodes} from "../../utils/err-codes.js";

export default class CreateStudent extends Endpoint {
    readonly path = "/student/create";

    readonly validators = [
        body('surname').isString(),
        body('name').isString(),
        body('class').isInt()
    ];

    protected async _post(req: e.Request, res: e.Response): Promise<any> {
        const {surname, name, class: classId} = req.body;

        try {
            const student = await prisma.student.create({
                data: {
                    surname: surname,
                    name: name,
                    class: {
                        connect: {
                            id: classId
                        }
                    }
                }
            });

            await res.json(student);

        } catch (e: PrismaClientKnownRequestError | any) {
            if (e.code === 'P2025') {
                await res.status(400).json({err: errCodes.ERR_CLASS_NOT_FOUND});
                return;
            }

            await res.status(500).json({err: errCodes.ERR_UNKNOWN});
        }
    }
}