/*
    BitGrades Authentication API

    This is the authentication API for BitGrades, it's only catching the /auth/ routes. Thoses are handled by the nginx reverse proxy that run the full app.

    This project was made by Elie "Fayorg" Baier, you can find the licence on github at this link : https://github.com/Fayorg/BitGrades-Auth
    For any others questions, please contact : support@bitgrades.app
*/

const express = require('express');

const app = express();
require('dotenv').config();
app.use(express.json());

// Setting up auth routes
require('./routes/register')(app); // -> /auth/register
require('./routes/login')(app); // -> /auth/login
require('./routes/verification')(app); // -> /auth/verification/[id]

app.listen(process.env.PORT || 3000, () => { console.log("[BitGrades-Authentication] API is running at http://localhost:" + (process.env.PORT || 3000)) });