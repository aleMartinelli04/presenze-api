import {Endpoint} from "./endpoint.js";
import e from "express";
import prisma from "../db/db.js";

export default class SchoolYears extends Endpoint {
    readonly path = "/school-years";

    readonly validators = [];

    protected async _get(req: e.Request, res: e.Response): Promise<any> {
        const schoolYears = await prisma.schoolYear.findMany();
        await res.json(schoolYears);
    }
}