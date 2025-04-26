import connector from "./config/db.config.js"
import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import { urlencoded } from "express"
import cors from "cors"
import { fileURLToPath } from "url"



dotenv.config()


const app = express()

app.use(express.json())
app.use(urlencoded({extended: true})) 
app.use(cookieParser)


app.use(
    cors(
        {
            origin : process.env.CORS,
            credentials:true
        }
    )
)

app.get("/", (req,res) => {

    res.send("Server is running ")
})


import adminRouter from "./routes/admin.route.js"
import userRouter from "./routes/auth.routes.js"
import roleRouter from "./routes/role.routes.js"
import path from "path"


app.use("/api/auth/user", userRouter)
app.use("/api/auth/admin", adminRouter)
app.use("/api/role", roleRouter)

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



const server = async() => {

    try {
        
        await connector()
        app.listen(process.env.PORT, () => {

            console.log(`server is running on port :${process.env.PORT}`);
            
        } )


    } catch (error) {
        console.log(error);

        process.exist(1)
        
    }
}

server()