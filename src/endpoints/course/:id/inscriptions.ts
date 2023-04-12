import {Endpoint} from "../../endpoint.js";
import {body, param} from "express-validator";
import e from "express";
import prisma from "../../../db/db.js";
import {errCodes} from "../../../utils/err-codes.js";

type Res = {
    notFoundStudents: number[],
    wrongYearStudents: number[],
    alreadyInCourseStudents: number[],
    inscribedStudents: number,
    removedStudents: number
};

export default class Inscriptions extends Endpoint {
    readonly path = "/course/:id/inscriptions";

    readonly validators = [
        param('id').isInt(),
        body('students').isArray().custom((students: any[]) => {
            return students.every(student => typeof student === 'number');
        })
    ];

    protected async _post(req: e.Request, res: e.Response): Promise<any> {
        const id = parseInt(req.params.id);
        let {students: studentIds}: { students: number[] } = req.body;

        studentIds = studentIds.filter((studentId, index) => studentIds.indexOf(studentId) === index);

        try {
            const course = await prisma.course.findUnique({
                where: {
                    id: id
                }
            });

            if (!course) {
                await res.status(404).json({error: errCodes.ERR_COURSE_NOT_FOUND});
                return;
            }

            // tutti gli studenti passati in input
            const students = await prisma.student.findMany({
                where: {
                    id: {
                        in: studentIds
                    }
                },
                include: {
                    class: {
                        select: {
                            school_year_id: true
                        }
                    }
                }
            });

            // studenti non trovati
            const notFoundStudents = studentIds.filter(studentId => !students.some(student => student.id === studentId));

            // elimina tutti quelli non passati in input
            const removedStudents = await prisma.inscriptions.deleteMany({
                where: {
                    course_id: id,
                    student_id: {
                        notIn: studentIds
                    }
                }
            });

            // studenti non dell'anno scolastico del corso
            const wrongYearStudents = students.filter(student => student.class.school_year_id !== course.school_year_id);

            // tutti gli studenti già iscritti al corso
            const alreadyInscribedStudents = await prisma.inscriptions.findMany({
                where: {
                    course_id: id,
                    student_id: {
                        in: studentIds
                    }
                }
            });

            // studenti da iscrivere
            const toInscribe = studentIds.filter(sId => {
                if (notFoundStudents.some(s => s === sId)) {
                    return false;
                }

                if (wrongYearStudents.some(s => s.id === sId)) {
                    return false;
                }

                if (alreadyInscribedStudents.some(i => i.student_id === sId)) {
                    return false;
                }

                return true;
            });

            const inscribedStudents = await prisma.inscriptions.createMany({
                data: toInscribe.map(studentId => ({
                    course_id: id,
                    student_id: studentId
                }))
            });

            const r: Res = {
                notFoundStudents: notFoundStudents,
                wrongYearStudents: wrongYearStudents.map(s => s.id),
                alreadyInCourseStudents: alreadyInscribedStudents.map(i => i.student_id),
                inscribedStudents: inscribedStudents.count,
                removedStudents: removedStudents.count
            }

            await res.status(200).json(r);

        } catch (e: Error | any) {
            console.error(e);
            await res.status(500).json({error: errCodes.ERR_UNKNOWN});
        }
    }
}