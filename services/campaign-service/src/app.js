require('dotenv').config();
const express = require('express');

const app = express();
app.use(express.json());

app.use('/api/campaigns', require('./routes/campaignRoutes'))

app.listen(process.env.PORT, () => {
    console.log(`Campaign service running on port ${process.env.PORT}`);
});
