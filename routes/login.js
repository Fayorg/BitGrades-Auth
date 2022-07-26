const database = require('./../utils/database')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

module.exports = (app) => {
    app.post('/login', async (req, res) => {
        
        // Checking if email and password has been parsed into the request
        if(!req.body.password || !req.body.email) { res.status(401).send({ result: false, message: "Email or/and Password not filled!"}); return; }

        try{
            // Get user from the database
            let user = await database.query("SELECT * FROM Users WHERE Email = ?", [req.body.email]);

            // Check if user exist in database
            if(!user[0]) { res.status(401).send({ result: false, message: "Incorrect Email or Password!"}); return; }

            // Check if the given password and saved password are the same
            if(!(await bcrypt.compare(req.body.password, user[0].Password))) { res.status(401).send({ result: false, message: "Incorrect Email or Password!"}); return; }

            // User authenticated, checking if user is active and has verified his email address
            if(!user[0].IsVerified) { res.status(401).send({ result: false, message: "You need to verify your email address before logging in!"}); return; }
            if(!user[0].IsActive) { res.status(401).send({ result: false, message: "Your account is disabled, please contact BitGrades support for more information!"}); return; }

            // Creating jwt user 
            let jwtUser = {
                ID: user[0].ID,
                email: req.body.email,
                firstName: user[0].FirstName,
                LastName: user[0].LastName
            }

            // Creating JWT token
            let token = jwt.sign(jwtUser, process.env.JWT_TOKEN, { expiresIn: "3600s" });

            // Check if user is configured
            if(!user[0].IsConfigured) { 
                res.status(200).send({ result: true, message: "Logged in!", token: token, configured: false}); 
                return; 
            } else {
                res.status(200).send({ result: true, message: "Logged in!", token: token, configured: true});
                return;
            }

        } catch(err) {
            // Return an error if the database connection cannot be established
            res.status(500).send({ result: false, message: "Something went wrong, Please try again! If this happen again, please contact BitGrades support!"}); 
            return;
        }

    })
}