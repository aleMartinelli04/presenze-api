import {Endpoint} from "./endpoint.js";
import {getCurrentYear} from "../utils/utils.js";
import prisma from "../db/db.js";
import {PrismaClientKnownRequestError} from "@prisma/client/runtime/index.js";
import {errCodes} from "../utils/err-codes.js";
import e from "express";

export default class CreateYear extends Endpoint {
    readonly path = "/year/create-current";

    readonly validators = [];

    protected async _post(req: e.Request, res: e.Response): Promise<any> {
        const id = getCurrentYear();

        try {
            const year = await prisma.schoolYear.create({
                data: {
                    start_year: id
                }
            });

            await res.json(year);

        } catch (e: PrismaClientKnownRequestError | any) {
            if (e.code === 'P2002') {
                await res.status(400).json({err: errCodes.ERR_YEAR_ALREADY_EXISTS});
                return;
            }

            await res.status(500).json({err: errCodes.ERR_UNKNOWN});
        }
    }
}