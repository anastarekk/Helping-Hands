require('dotenv').config();
const express = require('express');
const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(express.json());
app.use('/auth', authRoutes);

app.get('/protected', require('./middleware/authMiddleware'), (req, res) => {
    res.json({ message: 'Protected route', user: req.user })
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Auth service is running on port ${PORT}`)
});