const handleProfileGet = (req, res, db)=> {
    const { id } = req.params;
    // db.select('*').from('users').where({
    //     id: id
    // })
    db.select('*').from('users').where({ id })
        .then(user => {
            // if user array has more than 1 item
            if (user.length) {
                res.json(user[0]);
            } else {
                res.status(400).json('not found')
            }
        })
        .catch(err => res.status(400).json('error getting user'))
}

module.exports = {
    handleProfileGet: handleProfileGet
};