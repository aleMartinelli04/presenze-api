import {Endpoint} from "../endpoint.js";
import {Request, Response} from "express";
import {Class} from "@prisma/client";
import prisma from "../../db/db.js";

export default class ListClassEndpoint extends Endpoint {
    readonly path = "/classes";

    readonly validators = [];

    protected async _get(req: Request, res: Response<Class[]>): Promise<any> {
        const classes = await prisma.class.findMany();

        await res.json(classes);
    }
}