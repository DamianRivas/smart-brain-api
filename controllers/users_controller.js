const create = (req, res, db, bcrypt) => {
  // Validate credentials
  const { email, name, password } = req.body;
  if (!email || !name || !password) {
    return res.status(400).json('incorrect form submission');
  }

  bcrypt.hash(password, null, null, (err, hash) => {

    db.transaction(trx => {
      trx.insert({
        hash: hash,
        email: email
      })
        .into('login')
        .returning('email')
        .then(loginEmail => {
          return trx('users')
            .returning('*')
            .insert({
              name: name,
              email: loginEmail[0],
              joined: new Date()
            })
            .then(users => {
              res.json(users[0]);
            })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })


  })
  // .catch(err => res.status(400).json('unable to register'))
}

const show = (req, res) => {
  const { id } = req.params;

  db.select('*').from('users').where({ id })
    .then(user => {
      if (user.length) {
        res.json(user[0]);
      } else {
        throw 'User not found'
      }
    })
    .catch(err => res.status(400).json(err))
}

module.exports = {
  create: create,
  show: show
}
