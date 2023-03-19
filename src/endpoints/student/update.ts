import {Endpoint} from "../endpoint.js";
import {body, param} from "express-validator";
import {Request, Response} from "express";
import prisma from "../../db/db.js";
import {Student} from "@prisma/client";
import {PrismaClientKnownRequestError} from "@prisma/client/runtime";
import {Message} from "../../types/errors.js";

export default class UpdateStudentEndpoint extends Endpoint {
    readonly path = "/student/:id/update";

    readonly validators = [
        param('id').isInt(),
        body('name').optional().isString(),
        body('surname').optional().isString(),
        body('class_id').optional().isInt()
    ];

    protected async _put(req: Request, res: Response<Student | Message>): Promise<any> {
        const id = parseInt(req.params.id);

        const name = req.body.name;
        const surname = req.body.surname;
        const classId = req.body.class_id;

        try {
            const student = await prisma.student.update({
                where: {
                    id: id
                },
                data: {
                    name: name,
                    surname: surname,
                    class_id: classId
                }
            });

            await res.json(student);

        } catch (err) {
            const e = err as PrismaClientKnownRequestError;

            if (e.code == "P2025") {
                await res.status(404).json({message: "Invalid student id"});
                return;
            }

            if (e.code == "P2003") {
                await res.status(404).json({message: "Invalid class id"});
                return;
            }

            await res.status(500).json({message: "Unknown error"});
        }
    }
}