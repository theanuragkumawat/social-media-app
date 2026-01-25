import 'dotenv/config'
import {connectDB} from "../src/db/index.js"
import {app} from "./app.js"
// dotenv.config({ path: '' })
import dns from "dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);
// dns.setDefaultResultOrder("ipv4first");


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