import {Endpoint} from "../endpoint.js";
import {param} from "express-validator";
import {Request, Response} from "express";
import {Course} from "@prisma/client";
import {Message} from "../../types/errors.js";
import prisma from "../../db/db.js";

export default class DeleteCourseEndpoint extends Endpoint {
    readonly path = "/course/:id/delete";

    readonly validators = [
        param('id').isInt()
    ];

    protected async _delete(req: Request, res: Response<Course | Message>): Promise<any> {
        const id = parseInt(req.params.id);

        const course = await prisma.course.findUnique({
            where: {
                id: id
            }
        });

        if (!course) {
            await res.status(404).json({message: "Course not found"});
            return;
        }

        await prisma.course.delete({
            where: {
                id: id
            }
        });

        await res.json(course);
    }
}