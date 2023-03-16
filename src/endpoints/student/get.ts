import {Endpoint} from "../endpoint.js";
import {Request, Response} from "express";
import {Student} from "@prisma/client";
import prisma from "../../db/db.js";
import {param} from "express-validator";
import {Message} from "../../types/errors.js";

export default class GetStudentByIdEndpoint extends Endpoint {
    readonly path = "/student/get/:id";

    readonly validators = [
        param('id').isInt()
    ];

    protected async _get(req: Request, res: Response<Student | Message>): Promise<any> {
        const id = parseInt(req.params.id);

        const student = await prisma.student.findUnique({
            where: {
                id: id
            }
        });

        if (!student) {
            await res.status(404).json({message: "Student not found"});
            return;
        }

        await res.json(student);
    }
}