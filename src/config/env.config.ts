export const EnvConfiguration = () =>({
    environment: process.env.NODE_ENV || 'dev',
    mongoDb: process.env.MONGODB,
    port: process.env.PORT || 3001,
    defaultLimit: process.env.DEFAULT_LIMIT || 5
});