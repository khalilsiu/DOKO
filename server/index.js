require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { connectDB } = require('./src/db');
const { afterSaveNftTransactions } = require('./src/webhooks/moralis');
const initRouter = require('./src/routes');

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
initRouter(app);
app.post('/webhooks/nft-transfer', afterSaveNftTransactions);

connectDB()
  .then(() => {
    const port = +process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`App is running at ${port}`);
    });
  })
  .catch(err => {
    process.exit(1);
  });
