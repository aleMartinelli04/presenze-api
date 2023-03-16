import {Endpoint} from "../endpoint.js";
import {body, param} from "express-validator";
import {Request, Response} from "express";
import prisma from "../../db/db.js";
import {Class} from "@prisma/client";
import {Message} from "../../types/errors.js";

export default class EditClassEndpoint extends Endpoint {
    readonly path = "/class/update/:id";

    readonly validators = [
        param('id').isInt(),
        body('name').isString()
    ];

    protected async _post(req: Request, res: Response<Class | Message>): Promise<any> {
        const id = parseInt(req.params.id);
        const name = req.params.name;

        const classFound = await prisma.class.findUnique({
            where: {
                id: id
            }
        });

        if (!classFound) {
            await res.status(404).json({message: "Class not found"});
            return;
        }

        const updatedClass: Class = await prisma.class.update({
            where: {
                id: id
            },
            data: {
                name: name
            }
        });

        await res.json(updatedClass);
    }
}