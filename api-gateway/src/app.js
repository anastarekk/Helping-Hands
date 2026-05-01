require('dotenv').config();
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();

app.use(cors());

const proxyOptions = (target, pathFilter) => ({
    target,
    pathFilter,
    changeOrigin: true,
    onProxyReq: (proxyReq, req) => {
        if (req.headers.authorization) {
            proxyReq.setHeader('Authorization', req.headers['authorization']);
        }
    }
});

app.use(createProxyMiddleware(proxyOptions(process.env.AUTH_SERVICE_URL, '/auth')));
app.use(createProxyMiddleware(proxyOptions(process.env.CAMPAIGN_SERVICE_URL, '/api/campaigns')));
app.use(createProxyMiddleware(proxyOptions(process.env.DONATION_SERVICE_URL, '/api/donations')));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
});
