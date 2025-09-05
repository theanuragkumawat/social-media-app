import 'dotenv/config'
import {connectDB} from "../src/db/index.js"
import {app} from "./app.js"
// dotenv.config({ path: '' })

const port = process.env.PORT || 3000

connectDB()
.then(() => {
    app.listen(port, () => {
        console.log(`Server is running on ${port} Port`);
        
    })
})
.catch((error) => {
    console.log("connection failed!",error);
})