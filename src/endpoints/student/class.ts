import {Endpoint} from "../endpoint.js";
import {Request, Response} from "express";
import {Student} from "@prisma/client";
import prisma from "../../db/db.js";
import {param} from "express-validator";
import {Message} from "../../types/errors.js";

export default class GetStudentsByClassEndpoint extends Endpoint {
    readonly path = "/students/class/:class_id";

    readonly validators = [
        param('class_id').isInt()
    ];

    protected async _get(req: Request, res: Response<Student[] | Message>): Promise<any> {
        const classId = parseInt(req.params.class_id);

        const foundClass = await prisma.class.findUnique({
            where: {
                id: classId
            }
        });

        if (!foundClass) {
            await res.status(404).json({message: "Invalid class"});
            return;
        }

        const students = await prisma.student.findMany({
            where: {
                class_id: classId
            }
        });

        await res.json(students);
    }
}