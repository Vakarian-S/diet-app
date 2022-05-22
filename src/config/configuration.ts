export default () => ({
  database: {
    uri: process.env.DATABASE_URI,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
})
