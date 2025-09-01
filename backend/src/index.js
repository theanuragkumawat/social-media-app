import dotenv from 'dotenv'
import {connectDB} from "../src/db/index.js"
import {app} from "./app.js"
dotenv.config({ path: './.env' })

const port = process.env.PORT || 8000

connectDB()
.then(() => {
    app.listen(port, () => {
        console.log(`Server is running on ${port} Port`);
        
    })
})
.catch((error) => {
    console.log("connection failed!",error);
})