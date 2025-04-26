import { Router } from "express";
import { addrole, deleteRole, getRole, updateRole } from "../controller/role.controller.js";


const router = Router()



router.post("/add", addrole)

router.get("/get", getRole)

router.put("/role/:roleId", updateRole);

router.delete("/:roleId", deleteRole)



export default router