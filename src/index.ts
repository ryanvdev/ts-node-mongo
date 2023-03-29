import express from 'express';
import { controllerRouters } from './controllers';
import connectToDb from './loader/connectToDb';
import loadEnv from './loader/loadEnv';

const main = async () => {
    await loadEnv(); // ! Important

    await Promise.all([connectToDb()]);

    const app = express();

    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ limit: '10mb' }));
    app.use(controllerRouters());

    app.listen(__env.PORT, () => {
        console.log(`App running on port ${__env.PORT}`);
    });
};

main();
