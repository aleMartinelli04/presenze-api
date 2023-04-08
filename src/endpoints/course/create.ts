import {Endpoint} from "../endpoint.js";
import {body} from "express-validator";
import prisma from "../../db/db.js";
import {getCurrentYear} from "../../utils/utils.js";
import e from "express";
import {PrismaClientKnownRequestError} from "@prisma/client/runtime";
import {errCodes} from "../../utils/err-codes.js";

export default class CreateCourse extends Endpoint {
    readonly path = "/course/create";

    readonly validators = [
        body('name').isString(),
        body('year').optional().isInt().default(getCurrentYear())
    ];

    protected async _post(req: e.Request, res: e.Response): Promise<any> {
        const {name, year} = req.body;

        try {
            const course = await prisma.course.create({
                data: {
                    name: name,
                    school_year: {
                        connect: {
                            start_year: year
                        }
                    }
                }
            });

            await res.json(course);

        } catch (e: PrismaClientKnownRequestError | any) {
            if (e.code === 'P2025') {
                await res.status(400).json({err: errCodes.ERR_YEAR_NOT_FOUND});
                return;
            }

            await res.status(500).json({err: errCodes.ERR_UNKNOWN});
        }
    }
}