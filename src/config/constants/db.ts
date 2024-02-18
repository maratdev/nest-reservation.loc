export default () => ({
  port: process.env.DEFAULT_PORT,
  db: {
    port: process.env.MONGO_PORT,
    name: process.env.MONGO_DB,
    user: process.env.MONGO_LOGIN,
    password: process.env.MONGO_PASSWORD,
    host: process.env.MONGO_HOST,
    uri: process.env.MONGODB_URI,
  },
});
