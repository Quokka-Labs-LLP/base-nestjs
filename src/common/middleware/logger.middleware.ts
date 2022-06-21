import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from 'express';
import { appendFile, existsSync, mkdirSync } from 'fs';

@Injectable()
export class loggerMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        let dateMonthYear = `${new Date().getDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear()}`;
        const logDir = `${__dirname}/../../storage/logs/${dateMonthYear}`;
        let fileName = `general${dateMonthYear}.log`;

        let content = '============================req===============================================\r\n';
        content += `${req.originalUrl}\r\n`;
        content += `${new Date()}\r\n`;
        content += 'Headers\r\n';
        content += `${JSON.stringify(req.headers)}\r\n`;
        content += 'Body\r\n';
        content += `${JSON.stringify(req.body)}\r\n`;
        content += '==================================================================================\r\n';

        writeLog(logDir, fileName, content);
        next();
    }
}

let writeLog = (logDir, fileName, content) => {
    if (!existsSync(logDir)) {
        mkdirSync(logDir, { recursive: true });
    }
    appendFile(`${logDir}/${fileName}`, content, err => { if (err) { console.error(err); return; } });
}