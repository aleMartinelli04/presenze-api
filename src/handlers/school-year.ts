import {SchoolYear} from "@prisma/client";
import {Request, Response} from "express";
import prisma from "../db/db.js";
import {CreateError, GetByIdError} from "../types/errors.js";

export const getByStartYear = async (req: Request<{ start_year: number }>, res: Response<SchoolYear | GetByIdError>) => {
    const startYear = req.params.start_year as unknown as string;

    try {
        let schoolYear: SchoolYear = await prisma.schoolYear.findUniqueOrThrow({
            where: {
                start_year: parseInt(startYear)
            }
        });

        res.status(200).json(schoolYear);

    } catch (err) {
        res.status(404).json({message: "School year not found"});
    }
}

export const getAllSchoolYears = async (req: Request, res: Response<SchoolYear[]>) => {
    let schoolYears: SchoolYear[] = await prisma.schoolYear.findMany();

    res.json(schoolYears);
}

export const createSchoolYear = async (req: Request<{ start_year: number }>, res: Response<SchoolYear | CreateError>) => {
    const startYear = req.body.start_year;

    const schoolYearExists: SchoolYear | null = await prisma.schoolYear.findUnique({
        where: {
            start_year: startYear
        }
    });

    if (schoolYearExists) {
        res.status(400).json({message: "School year already exists"});
        return;
    }

    let schoolYear: SchoolYear = await prisma.schoolYear.create({
        data: {
            start_year: startYear
        }
    });

    if (!schoolYear) {
        res.status(400).json({message: "School year not created"});
        return;
    }

    res.status(200).json(schoolYear);
}