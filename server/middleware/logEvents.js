

import fs from 'node:fs';
import fsPromises  from 'node:fs/promises';
const dir = import.meta.dirname;
import { format } from 'date-fns';
const { v4: uuid } = await import('uuid');
import path from 'path';




// can be more than one parameter besides 'message'
const logEvents = async (message, logName) => {
    const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`
    const logItem = `${dateTime}\t ${uuid()}\t${message}\n`;
    console.log(logItem);

    // todo: get an external log provider setup. can store in /tmp/logs on vercel but not persistent for long time
    // try {
    //     if (!fs.existsSync(path.join(dir, '..', 'logs'))) {
    //         await fsPromises.mkdir(path.join(dir, '..', 'logs'))
    //     }
    //     await fsPromises.appendFile(path.join(dir, '..', 'logs', logName), logItem)
    // } catch (err) {
    //     console.log(err);
    // }
    // testing

}

const logger = async (req, res, next) => {
    // todo: get an external log provider setup. can store in /tmp/logs on vercel but not persistent for long time
    // logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, 'reqLog.txt');
    console.log(`${req.method}\t${req.headers.origin}\t${req.url}`);
    next();
}


export { logger, logEvents };