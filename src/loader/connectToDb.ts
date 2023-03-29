import mongoose from 'mongoose';

function makeConnectionString() {
    const connectionUrl = new URL('mongodb://');
    connectionUrl.host = __env.DB_HOST;
    connectionUrl.port = __env.DB_PORT.toString();

    if (__env.DB_USERNAME) connectionUrl.username = __env.DB_USERNAME;
    if (__env.DB_PASSWORD) connectionUrl.password = __env.DB_PASSWORD;

    return connectionUrl.toJSON();
}

async function connectToDb() {
    await mongoose.connect(makeConnectionString(), {
        dbName: __env.DB_DATABASE_NAME,
        directConnection: true,
        authMechanism: 'DEFAULT',
        keepAlive: true,
    });

    if (mongoose.connection.readyState !== 1) {
        throw new Error('Connect to database failed');
    }
}

export default connectToDb;
