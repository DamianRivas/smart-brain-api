const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

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
  ]
}

app.get('/', (req, res) => {
  res.send(database.users);
});

app.post('/signin', (req, res) => {
  if (req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
    res.json('success');
  } else {
    res.status(400).json('Error logging in');
  }
  res.json({ name: "Damian" });
})

app.post('/register', (req, res) => {
  const { email, name, password } = req.body;
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
