type SchoolYear = {
    startYear: number;
}

type Class = {
    name: string;
    schoolYearId: number;
}

type Student = {
    name: string;
    surname: string;
    classId: number;
}

type Course = {
    name: string;
    schoolYearId: number;
}

type Inscription = {
    studentId: number;
    courseId: number;
}