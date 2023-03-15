import {Request, Response} from "express";
import {Class} from "@prisma/client";
import prisma from "../db/db.js";
import {CreateError} from "../types/errors.js";

export const getClasses = async (req: Request, res: Response<Class[]>) => {
    const classes: Class[] = await prisma.class.findMany();

    res.json(classes);
}

export const getClassesForYear = async (req: Request<{ school_year: number }>, res: Response<Class[]>) => {
    const schoolYear = req.params.school_year as unknown as string;

    const classes: Class[] = await prisma.class.findMany({
        where: {
            school_year_id: parseInt(schoolYear)
        }
    });

    res.json(classes);
}

export const createClass = async (req: Request<{ school_year: number }>, res: Response<Class | CreateError>) => {
    const schoolYear = req.params.school_year as unknown as string;
    const className = req.body.name;

    if (!className || className.length < 1) {
        res.status(400).json({message: "Invalid class name"});
        return;
    }

    try {
        const newClass: Class = await prisma.class.create({
            data: {
                name: className,
                school_year_id: parseInt(schoolYear)
            }
        });

        res.json(newClass);

    } catch (err) {
        res.status(500).json({message: "Error while creating class"});
    }
}

export const deleteClass = async (req: Request<{ class_id: number }>, res: Response<Class | CreateError>) => {
    const schoolYear = req.params.class_id as unknown as string;

    try {
        const deletedClass: Class = await prisma.class.delete({
            where: {
                id: parseInt(schoolYear)
            }
        });

        res.json(deletedClass);

    } catch (err) {
        res.status(500).json({message: "Error while deleting class"});
    }
}