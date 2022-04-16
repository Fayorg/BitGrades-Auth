const database = require('./../utils/database');

module.exports = (app) => {
    app.get('/verification/*', async (req, res) => {
        
        // Get the id parsed in the path: req.url.replace("/verification/", "")

        // Control if there is an ID given into the request
        if(!req.url.replace("/verification/", "")) { res.status(401).send({ result: false, message: "You need to provide an ID to verify your email address!"}); return; }

        try {
            // Control if the parsed ID is in the database
            let id = await database.query("SELECT * FROM EmailVerification WHERE ID = ?", [req.url.replace("/verification/", "")]);
            if(id[0] == null) {
                // ID don't exist in database 
                res.status(401).send({ result: false, message: "Verification ID not found!"});
                return; 
            } else {
                // Found a match in the database

                // Delete the entry into the verification table in database
                await database.query("DELETE FROM EmailVerification WHERE ID = ?", [id[0].ID]);

                // Set the user to verified into Users's database
                await database.query("UPDATE Users SET IsVerified = ? WHERE ID = ?", [true, id[0].UserID])

                res.status(200).send({ result: true, message: "Email Verified!"});
                return;
            }

        } catch(err) {
            // Return an error if the database connection cannot be established
            res.status(500).send({ result: false, message: "Something went wrong, Please try again! If this happen again, please contact BitGrades support!"}); 
            return;
        }

    })
}