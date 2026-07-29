import sequelizeConfig from "./dbConfig.js"

let connected = false

export async function connectDB() {
    if (connected) return

    try {
        await sequelizeConfig.authenticate()
        connected = true
        console.log("Database connected")
    } catch(err) {
        connected = false
        console.error("Database connection failed", err)
        throw err
    }
}