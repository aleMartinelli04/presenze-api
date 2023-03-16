import {Endpoint} from "../endpoint.js";
import {Request, Response} from "express";
import {Student} from "@prisma/client";
import prisma from "../../db/db.js";
import {body} from "express-validator";
import {Message} from "../../types/errors.js";

export default class CreateStudentEndpoint extends Endpoint {
    readonly path = "/student/create";

    readonly validators = [
        body('name').isString(),
        body('surname').isString(),
        body('class_id').isInt()
    ];

    protected async _post(req: Request, res: Response<Student | Message>): Promise<any> {
        const name = req.body.name;
        const surname = req.body.surname;
        const classId = parseInt(req.body.class_id);

        const foundClass = await prisma.class.findUnique({
            where: {
                id: classId
            }
        });

        if (!foundClass) {
            await res.status(404).json({message: "Invalid class"});
            return;
        }

        const student = await prisma.student.create({
            data: {
                name: name,
                surname: surname,
                class_id: classId
            }
        });

        await res.json(student);
    }
}