import {Endpoint} from "../endpoint.js";
import {Request, Response} from "express";
import {Student} from "@prisma/client";
import prisma from "../../db/db.js";
import {body} from "express-validator";
import {Message} from "../../types/errors.js";

export default class DeleteStudentEndpoint extends Endpoint {
    readonly path = "/student/delete";

    readonly validators = [
        body('id').isInt()
    ];

    protected async _delete(req: Request, res: Response<Student | Message>): Promise<any> {
        const id = parseInt(req.body.id);

        const student = await prisma.student.findUnique({
            where: {
                id: id
            }
        });

        if (!student) {
            await res.status(404).json({message: "Student not found"});
            return;
        }

        await prisma.student.delete({
            where: {
                id: id
            }
        });

        await res.json(student);
    }
}