const handleRegister = (req, res, db, bcrypt) => {
    //to grab details in register field
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
        return res.status(400).json('incorrect form submission')
    }
    const hash = bcrypt.hashSync(password);
        // use transaction when inserting to two tables 
        db.transaction(trx => {
            trx.insert({
                // putting bcrypt hash to hash column 
                hash: hash,
                email: email
            })
            .into('login')
            // returning email to use for table user 
            .returning('email')
            .then(loginEmail => {
                // using return so that the parent database knows about this database below
                return trx('users')
                    .returning('*')
                    .insert({
                        email: loginEmail[0].email, 
                        name: name,
                        joined: new Date()
                    })
                    .then(user => {
                        res.json(user[0]);
                    })
            })
            // in order to apply changes when using transaction method
            .then(trx.commit)
            // rollback when anything fails
            .catch(trx.rollback)
        })
        .catch(err => res.status(400).json('unable to register'))
}

module.exports = {
    handleRegister: handleRegister
};

