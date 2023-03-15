import {Router} from "express";
import {createSchoolYear, deleteSchoolYear, getAllSchoolYears, getByStartYear} from "../handlers/school-year.js";

const router = Router();

router.get("/all", getAllSchoolYears);
router.get("/:start_year", getByStartYear);

router.post("/create", createSchoolYear)

router.delete("/delete/:start_year", deleteSchoolYear);

export default router;