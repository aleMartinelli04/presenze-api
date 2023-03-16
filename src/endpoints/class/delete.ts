import {Endpoint} from "../endpoint.js";
import {body} from "express-validator";
import {Request, Response} from "express";
import {Class} from "@prisma/client";
import {Message} from "../../types/errors.js";
import prisma from "../../db/db.js";

export default class DeleteClassEndpoint extends Endpoint {
    readonly path = "/class/delete";

    readonly validators = [
        body('id').isInt()
    ];

    protected async _delete(req: Request, res: Response<Class | Message>): Promise<any> {
        const id = parseInt(req.body.id);

        const foundClass = await prisma.class.findUnique({
            where: {
                id: id
            }
        });

        if (!foundClass) {
            await res.status(404).json({message: "Class not found"});
            return;
        }

        const deletedClass = await prisma.class.delete({
            where: {
                id: id
            }
        });

        await res.json(deletedClass);
    }
}