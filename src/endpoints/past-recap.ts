import {Endpoint} from "./endpoint.js";
import e from "express";
import prisma from "../db/db.js";

export default class PastRecap extends Endpoint {
    readonly path = "/past-recap";

    readonly validators = [];

    protected async _get(req: e.Request, res: e.Response): Promise<any> {
        const years = await prisma.schoolYear.findMany({
            include: {
                courses: {
                    include: {
                        inscriptions: {
                            include: {
                                student: true
                            }
                        }
                    }
                },
                classes: {
                    include: {
                        students: true
                    }
                }
            },
            orderBy: {
                start_year: "desc"
            }
        });

        res.json(years);
    }
}