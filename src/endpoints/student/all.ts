import {Endpoint} from "../endpoint.js";
import {Request, Response} from "express";
import {Student} from "@prisma/client";
import prisma from "../../db/db.js";

export default class GetAllStudentsEndpoint extends Endpoint {
    readonly path = "/students";

    readonly validators = [];

    protected async _get(req: Request, res: Response<Student[]>): Promise<any> {
        const students = await prisma.student.findMany();

        await res.json(students);
    }
}