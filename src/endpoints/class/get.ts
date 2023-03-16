import {Endpoint} from "../endpoint.js";
import {param} from "express-validator";
import {Request, Response} from "express";
import {Message} from "../../types/errors.js";
import {Class} from "@prisma/client";
import prisma from "../../db/db.js";

export default class GetClassEndpoint extends Endpoint {
    readonly path = "/class/get/:id";

    readonly validators = [
        param('id').isInt()
    ];

    protected async _get(req: Request, res: Response<Class | Message>): Promise<any> {
        const classId = parseInt(req.params.id);

        const classFound = await prisma.class.findUnique({
            where: {
                id: classId
            }
        });

        if (!classFound) {
            await res.status(404).json({message: "Class not found"});
            return;
        }

        await res.json(classFound);
    }
}