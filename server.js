require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const users_controller = require('./controllers/users_controller');
const signin = require('./controllers/signin');
const image = require('./controllers/image');

const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: 'smart-brain'
  }
});

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => res.status(200).json('success'));
app.post('/signin', signin.handleSignin(db, bcrypt));
app.post('/register', (req, res) => users_controller.create(req, res, db, bcrypt));
app.get('/profile/:id', (req, res) => users_controller.show(req, res, db));
app.put('/image', (req, res) => image.handleEntry(req, res, db));
app.post('/imageurl', (req, res) => image.handleImage(req, res));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}...`);
});
