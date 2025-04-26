import connector from "./config/db.config.js"
import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import { urlencoded } from "express"
import cors from "cors"


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


import userRouter from "./routes/user.routes.js"
import adminRouter from "./routes/user.routes.js"


app.use("/api/auth/user", userRouter)
app.use("/api/auth/admin", adminRouter)



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