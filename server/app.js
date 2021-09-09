require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { connectDB } = require('./src/db');
const { afterSaveNftTransactions } = require('./src/webhooks/moralis');
const initRouter = require('./src/routes');
const { setupCronJobs } = require('./src/jobs');

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
initRouter(app);
app.post('/api/webhooks/nft-transfer', afterSaveNftTransactions);

let server;
let dbClient;

connectDB()
  .then(client => {
    dbClient = client;
    const port = +process.env.PORT || 3000;
    server = app.listen(port, '0.0.0.0', () => {
      console.log(`App is running at ${port}`);
      setupCronJobs();
    });
  })
  .catch(err => {
    process.exit(1);
  });

process.once('SIGUSR2', function () {
  process.kill(process.pid, 'SIGUSR2');
});

process.on('SIGINT', function () {
  // this is only called on ctrl+c, not restart
  process.kill(process.pid, 'SIGINT');
});
