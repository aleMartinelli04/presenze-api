import {Endpoint} from "../endpoint.js";
import {param} from "express-validator";
import {Request, Response} from "express";
import prisma from "../../db/db.js";
import {Course} from "@prisma/client";
import {Message} from "../../types/errors.js";

export default class GetCourseByIdEndpoint extends Endpoint {
    readonly path = "/course/:id";

    readonly validators = [
        param('id').isInt()
    ];

    protected async _get(req: Request, res: Response<Course | Message>) {
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

        await res.json(course);
    }
}