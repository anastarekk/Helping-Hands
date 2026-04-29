require('dotenv').config();
const express = require('express');

const app = express();
app.use(express.json());
app.use('/api/donations', require('./routes/donationRoutes'));

app.listen(process.env.PORT, () => {
    console.log(`Donation service running on port ${process.env.PORT}`);
});

module.exports = app;