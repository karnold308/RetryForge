

export function verifyCron(req, res, next) {
    const auth = req.headers.authorization

    if (!auth?.startsWith("Bearer ")) {
        return res.sendStatus(401)
    }

    const token = auth.split(" ")[1]

    if (token !== process.env.CRON_SECRET) {
        return res.sendStatus(401)
    }

    next()
}
