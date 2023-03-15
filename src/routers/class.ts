import {Router} from "express";
import {createClass, deleteClass, getClasses, getClassesForYear} from "../handlers/class.js";

const router = Router();

router.get("/all", getClasses);
router.get("/all/:school_year", getClassesForYear);

router.post("/create/:school_year", createClass);

router.delete("/delete/:class_id", deleteClass);

export default router;