const database = require('./../utils/database')
const crypto = require('crypto');
const bcrypt = require('bcrypt');

module.exports = (app) => {
    app.post('/register', async (req, res) => {
        
        // Checking if email and password has been parsed into the request
        if(!req.body.password || !req.body.email || !req.body.firstName || !req.body.lastName) { res.status(401).send({ result: false, message: "Email, Password, First or/and Last name not filled!"}); return; }

        // Checking if the email address domain is eduvaud.ch
        if((req.body.email).split("@")[1] != "eduvaud.ch") { res.status(401).send({ result: false, message: "You need an Eduvaud email address to create an account!"}); return; }
        try {
            // Checking if the user already exist
            if((await database.query("SELECT * FROM Users WHERE Email = ?", [req.body.email]))[0] != null) { res.status(401).send({ result: false, message: "Email already used!"}); return; }
            
            // Creating an ID for the new user
            let userId = crypto.randomBytes(32).toString('hex');
            // Hashing user's password
            let userPassword = await bcrypt.hash(req.body.password, 10);
            // And finally, insert the user into the database
            await database.query("INSERT INTO Users (ID, Email, Password, FirstName, LastName) VALUES (?, ?, ?, ?, ?)", [userId, req.body.email, userPassword, req.body.firstName, req.body.lastName]);

            // Creating an ID for email verification pupuses
            await database.query("INSERT INTO EmailVerification (ID, UserID) VALUES (?, ?)", [crypto.randomBytes(32).toString('hex'), userId]);

            res.status(200).send({ result: true, message: "Account created, please verify your email!"});
            return;

        } catch(err) {
            // Return an error if the database connection cannot be established
            res.status(500).send({ result: false, message: "Something went wrong, Please try again! If this happen again, please contact BitGrades support!"}); 
            return;
        }
    })
}