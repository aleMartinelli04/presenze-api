import {Endpoint} from "../endpoint.js";
import {Request, Response} from "express";
import {Course} from "@prisma/client";
import prisma from "../../db/db.js";

export default class GetAllCoursesEndpoint extends Endpoint {
    readonly path = "/courses";

    readonly validators = [];

    protected async _get(req: Request, res: Response<Course[]>): Promise<any> {
        const courses = await prisma.course.findMany();

        await res.json(courses);
    }
}