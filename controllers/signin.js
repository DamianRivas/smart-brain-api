const handleSignin = (db, bcrypt) => (req, res) => {
  // Validate credentials
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json('incorrect form submission');
  }

  db.select('email', 'hash').from('login')
    .where('email', '=', email)
    .then(data => {
      bcrypt.compare(password, data[0].hash, (err, result) => {
        if (result) {
          return db.select('*').from('users')
            .where('email', email)
            .then(user => {
              res.json(user[0]);
            })
            .catch(err => res.status(400).json('Unable to retrieve user'))
        } else {
          // If the password is incorrect...
          res.status(400).json('Wrong credentials');
        }
      })
    })
    .catch(err => {
      // If the email is incorrect...
      res.status(400).json('Wrong credentials');
    })
}

module.exports = {
  handleSignin: handleSignin
}
