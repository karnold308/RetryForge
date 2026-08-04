import sequelizeConfig from "./dbConfig.js"
import { logError } from '../services/loggerService.js'

let connected = false

export async function connectDB() {
    if (connected) return

    try {
        await sequelizeConfig.authenticate()
        connected = true
        console.log("Database connected")
    } catch (err) {
        connected = false
        
        await logError({
            source: "dbConnect",
            message: "database cannot connect",
            error: err,
            metadata: {
                
            }
        })
        throw err
    }
}