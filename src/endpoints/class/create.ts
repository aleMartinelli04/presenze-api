import {Endpoint} from "../endpoint.js";
import e from "express";
import prisma from "../../db/db.js";
import {body} from "express-validator";
import {getCurrentYear} from "../../utils/utils.js";
import {errCodes} from "../../utils/err-codes.js";

export default class CreateClass extends Endpoint {
    readonly path = "/class/create";

    readonly validators = [
        body('name').isString(),
        body('year').optional().isInt().default(getCurrentYear()),
    ];

    protected async _post(req: e.Request, res: e.Response): Promise<any> {
        const {name, year} = req.body;

        try {
            const newClass = await prisma.class.create({
                data: {
                    name: name,
                    school_year: {
                        connect: {
                            start_year: year
                        }
                    }
                }
            });

            res.json(newClass);

        } catch (e) {
            res.status(404).json({err: errCodes.ERR_YEAR_NOT_FOUND});
        }
    }
}