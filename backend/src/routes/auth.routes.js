import { Router } from "express";
import { login, logOut, register } from "../controller/auth.controller.js";
import upload from "../middleware/multer.middleware.js";


const router = Router()


router.post("/register",
    upload.fields(
        [
            {
                name:"avatar",
                
            }
        ]
    ),
    register
)
router.post("/login", login)
router.post("/log-out", logOut)


export default router

