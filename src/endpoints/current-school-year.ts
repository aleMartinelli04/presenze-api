import {Endpoint} from "./endpoint.js";
import prisma from "../db/db.js";
import e from "express";
import {getCurrentYear} from "../utils/utils.js";
import {errCodes} from "../utils/err-codes.js";

export default class CurrentSchoolYear extends Endpoint {
    readonly path = "/current-school-year";

    readonly validators = [];

    protected async _get(req: e.Request, res: e.Response): Promise<any> {
        const currentSchoolYear = await prisma.schoolYear.findFirst({
            where: {
                start_year: getCurrentYear()
            }
        });

        if (!currentSchoolYear) {
            await res.status(404).json({err: errCodes.ERR_YEAR_NOT_FOUND});
        }

        await res.json(currentSchoolYear);
    }
}