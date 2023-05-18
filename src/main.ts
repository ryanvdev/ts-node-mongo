import path from 'path';
import express from 'express';
import { createControllerRouter } from './controllers';
import connectToDatabase from './loader/connectToDatabase';
import parseEnv from './utils/envloader';
import { envschema } from './configs/envschema';
import loadGlobalVariables from './loader/loadGlobalVariables';
import loadRootAccount from './loader/loadRootAccount';
import cookieParser from 'cookie-parser';
import { logRequestMiddleware } from './middleware/http/logRequestMiddelware';

const main = async () => {
    await loadGlobalVariables(); // ! Important

    await parseEnv({
        absoluteEnvDir: path.join(__dirname, '../.env'),
        createIfNotExists: true,
        envschemaFn: envschema,
    }); // ! Important

    console.dir(__env);

    await Promise.all([connectToDatabase()]);

    // after connected to database
    const [controllerRouter] = await Promise.all([createControllerRouter(), loadRootAccount()]);

    const app = express();

    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ limit: '10mb', extended: true }));
    app.use(cookieParser());

    // ! Log Request
    // app.use(logRequestMiddleware);

    app.use(controllerRouter);

    app.listen(__env.PORT, () => {
        console.log(`App running on port ${__env.PORT}`);
    });
};

main();
