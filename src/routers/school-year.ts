import {Router} from "express";
import {createSchoolYear, getAllSchoolYears, getByStartYear} from "../handlers/school-year.js";

const router = Router();

router.get("/all", getAllSchoolYears);
router.get("/:start_year", getByStartYear);

router.post("/create", createSchoolYear)

export default router;