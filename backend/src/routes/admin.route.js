import { Router } from "express";
import { login, logOut, register } from "../controller/auth.controller.js";


const router = Router()


router.post("/register", register)
router.post("/login", login)
router.post("/log-out", logOut)


export default router

