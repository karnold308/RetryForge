

    const fs = await import('fs');
    const fsPromises = await import('fs').promises;
    const path = await import('path');
    const { format } = await import('date-fns');
    const { v4: uuid } = await import('uuid');




// can be more than one parameter besides 'message'
const logEvents = async (message, logName) => {
    const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`
    const logItem = `${dateTime}\t ${uuid()}\t${message}\n`;
    console.log(logItem);

    try {
        if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
            await fsPromises.mkdir(path.join(__dirname, '..', 'logs'))
        }
        await fsPromises.appendFile(path.join(__dirname, '..', 'logs', logName), logItem)
    } catch (err) {
        console.log(err);
    }
    // testing

}

const logger = async (req, res, next) => {
    logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, 'reqLog.txt');
    console.log(`${req.method} ${req.path}`);
    next();
}


module.exports = { logger, logEvents };