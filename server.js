const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

const app = express();

const database = {
  users: [
    {
      id: '123',
      name: "Damian",
      email: "user@example.com",
      password: 'helloworld',
      entries: 0,
      joined: new Date()
    },
    {
      id: '124',
      name: "John",
      email: "john@example.com",
      password: 'helloworld',
      entries: 0,
      joined: new Date()
    }
  ],
  login: [
    {
      id: '123',
      hash: '',
      email: 'user@example.com'
    }
  ]
}

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send(database.users);
});

app.post('/signin', (req, res) => {
  if (req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
    res.json(database.users[0]);
  } else {
    res.status(400).json('Error logging in');
  }
})

app.post('/register', (req, res) => {
  const { email, name, password } = req.body;
  bcrypt.hash(password, null, null, (err, hash) => {
    console.log(hash);
  });
  database.users.push({
    id: '125',
    name: name,
    email: email,
    password: password,
    entries: 0,
    joined: new Date()
  })

  res.json(database.users[database.users.length - 1]);
})

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  database.users.forEach(user => {
    if (user.id === id) {
      return res.json(user);
    }
  });
  res.status(404).json('no such user');
});

app.put('/image', (req, res) => {
  const { id } = req.body;
  database.users.forEach(user => {
    if (user.id === id) {
      return res.json(++user.entries);
    }
  });
  res.status(404).json('no such user');
});



// Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//   // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//   // res = false
// });

app.listen(3000, () => {
  console.log('App is running on port 3000...')
});



/*
  / --> res = this is working
  /signin --> POST = success/fail
  /register --> POST = user
  /profile/:userId --> GET = user
  /image --> PUT --> user
*/
