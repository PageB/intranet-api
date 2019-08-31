const express = require('express');
const cors = require('cors')
require('./db/mongoose');
const usersRouter = require('./routers/users')
const organisationRouter = require('./routers/organisations')

const app = express();
app.use(cors())

// app.use((req, res, next) => {
//     res.status(503).send('Service is currently down. Check back soon! Expected down time is about 1 hour.')
// });

app.use(express.json());
app.use('/users', usersRouter);
app.use('/organisations', organisationRouter);

module.exports = app;